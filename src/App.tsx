import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { FlowDiagram } from './components/FlowDiagram';
import { OrderForm } from './components/OrderForm';
import { HttpMethodsExplorer } from './components/HttpMethodsExplorer';
import { StatusCodeVisualizer } from './components/StatusCodeVisualizer';
import { JsonInspector } from './components/JsonInspector';
import { DatabaseExplorer } from './components/DatabaseExplorer';
import { PresentationModal } from './components/PresentationModal';
import { LearningDrawer } from './components/LearningDrawer';

import { INITIAL_MENU, INITIAL_ORDERS } from './data/mockData';
import type { Order } from './types';
import {
  type GeneratedSimulation,
  generateGetMenuSimulation,
  generatePostOrderSimulation,
  generateGetOrderSimulation,
  generatePutOrderSimulation,
  generatePatchOrderSimulation,
  generateDeleteOrderSimulation,
  generateCustomErrorSimulation,
} from './services/simulationGenerator';

export const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [simulation, setSimulation] = useState<GeneratedSimulation>(() =>
    generateGetMenuSimulation()
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [lastMutatedId, setLastMutatedId] = useState<number | null>(null);
  const [isPresentationOpen, setIsPresentationOpen] = useState<boolean>(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);

  const appliedMutationRef = useRef<boolean>(false);

  // Auto-play timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      const delay = Math.max(800, 2200 / speed);
      timer = setTimeout(() => {
        if (currentStepIndex < simulation.steps.length - 1) {
          const nextIndex = currentStepIndex + 1;
          setCurrentStepIndex(nextIndex);

          // Apply database mutation once step reaches DATABASE node or RESPONSE node
          const step = simulation.steps[nextIndex];
          if (
            (step.nodeId === 'DATABASE' || step.nodeId === 'RESPONSE') &&
            simulation.databaseMutation &&
            !appliedMutationRef.current
          ) {
            setOrders((prev) => simulation.databaseMutation!(prev));
            appliedMutationRef.current = true;
          }
        } else {
          setIsPlaying(false);
        }
      }, delay);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, simulation, speed]);

  const startNewSimulation = (newSim: GeneratedSimulation) => {
    setIsPlaying(false);
    appliedMutationRef.current = false;
    setSimulation(newSim);
    setCurrentStepIndex(0);
    // Auto start playback
    setTimeout(() => {
      setIsPlaying(true);
    }, 150);
  };

  // Scenario 1: POST /orders from form
  const handlePlaceOrder = (orderData: {
    customer: string;
    items: { name: string; quantity: number; price: number }[];
    note?: string;
  }) => {
    const sim = generatePostOrderSimulation(orderData);
    setLastMutatedId(sim.response.body?.data?.id || null);
    startNewSimulation(sim);
  };

  // Scenario 2: HTTP Methods Explorer trigger
  const handleTriggerMethod = (method: string, targetId?: number) => {
    const foundOrder = orders.find((o) => o.id === targetId);

    switch (method) {
      case 'GET':
        if (targetId) {
          startNewSimulation(generateGetOrderSimulation(targetId, foundOrder));
        } else {
          startNewSimulation(generateGetMenuSimulation());
        }
        break;
      case 'POST':
        startNewSimulation(
          generatePostOrderSimulation({
            customer: 'Mahasiswa Baru 2026',
            items: [
              { name: 'Nasi Goreng', quantity: 1, price: 18000 },
              { name: 'Es Teh Manis', quantity: 1, price: 5000 },
            ],
            note: 'Pesanan cepat untuk demo kelas',
          })
        );
        break;
      case 'PUT':
        if (targetId) {
          startNewSimulation(
            generatePutOrderSimulation(
              targetId,
              {
                customer: foundOrder?.customer || 'Pelanggan Meja',
                items: [{ name: 'Ayam Bakar', quantity: 2, price: 25000 }],
                note: 'Ganti seluruh menu (PUT)',
              },
              foundOrder
            )
          );
          setLastMutatedId(targetId);
        }
        break;
      case 'PATCH':
        if (targetId) {
          startNewSimulation(
            generatePatchOrderSimulation(
              targetId,
              { note: 'Catatan diperbarui: Tambah sambal banyak (PATCH)' },
              foundOrder
            )
          );
          setLastMutatedId(targetId);
        }
        break;
      case 'DELETE':
        if (targetId) {
          startNewSimulation(generateDeleteOrderSimulation(targetId, foundOrder));
          setLastMutatedId(null);
        }
        break;
      default:
        startNewSimulation(generateGetMenuSimulation());
    }
  };

  // Scenario 3: Custom Status Code triggers
  const handleTriggerStatus = (code: number) => {
    switch (code) {
      case 200:
        startNewSimulation(generateGetMenuSimulation());
        break;
      case 201:
        startNewSimulation(
          generatePostOrderSimulation({
            customer: 'Demo Mahasiswa 2026',
            items: [{ name: 'Ayam Bakar', quantity: 1, price: 25000 }],
            note: 'Simulasi HTTP 201 Created',
          })
        );
        break;
      case 204:
        if (orders.length > 0) {
          const target = orders[0];
          startNewSimulation(generateDeleteOrderSimulation(target.id, target));
        } else {
          startNewSimulation(generateCustomErrorSimulation(404));
        }
        break;
      case 404:
        startNewSimulation(generateGetOrderSimulation(999, undefined));
        break;
      case 400:
      case 401:
      case 403:
      case 500:
      default:
        startNewSimulation(generateCustomErrorSimulation(code));
        break;
    }
  };

  // Step controls
  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < simulation.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);

      const step = simulation.steps[nextIndex];
      if (
        (step.nodeId === 'DATABASE' || step.nodeId === 'RESPONSE') &&
        simulation.databaseMutation &&
        !appliedMutationRef.current
      ) {
        setOrders((prev) => simulation.databaseMutation!(prev));
        appliedMutationRef.current = true;
      }
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleResetStep = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleToggleSpeed = () => {
    setSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  const handleFullReset = () => {
    setIsPlaying(false);
    setOrders(INITIAL_ORDERS);
    setLastMutatedId(null);
    appliedMutationRef.current = false;
    const sim = generateGetMenuSimulation();
    setSimulation(sim);
    setCurrentStepIndex(0);
  };

  return (
    <div className="min-h-screen bg-darkbg text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Header
        onReset={handleFullReset}
        onTogglePresentation={() => setIsPresentationOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* SECTION 1: VISUAL FLOW PIPELINE (Central piece) */}
        <FlowDiagram
          currentStepIndex={currentStepIndex}
          steps={simulation.steps}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onResetStep={handleResetStep}
          speed={speed}
          onToggleSpeed={handleToggleSpeed}
        />

        {/* SECTION 2: INTERACTIVE CONTROLS & DEV TOOLS (Two columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Client Order Form & HTTP Methods Explorer */}
          <div className="lg:col-span-6 space-y-6 flex flex-col">
            <div className="flex-1">
              <OrderForm
                menuItems={INITIAL_MENU}
                onPlaceOrder={handlePlaceOrder}
                isSimulating={isPlaying}
              />
            </div>
            <div className="flex-1">
              <HttpMethodsExplorer
                orders={orders}
                onTriggerMethod={handleTriggerMethod}
                isSimulating={isPlaying}
              />
            </div>
          </div>

          {/* Right Column: Status Code Visualizer & JSON Inspector */}
          <div className="lg:col-span-6 space-y-6 flex flex-col">
            <div>
              <StatusCodeVisualizer
                onTriggerStatus={handleTriggerStatus}
                isSimulating={isPlaying}
              />
            </div>
            <div className="flex-1">
              <JsonInspector
                request={simulation.request}
                response={simulation.response}
                timeline={simulation.timeline}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: VIRTUAL DATABASE EXPLORER */}
        <DatabaseExplorer
          orders={orders}
          onSelectOrderForGet={(id) => handleTriggerMethod('GET', id)}
          onSelectOrderForPatch={(id) => handleTriggerMethod('PATCH', id)}
          onSelectOrderForDelete={(id) => handleTriggerMethod('DELETE', id)}
          lastMutatedId={lastMutatedId}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-darkborder/70 py-6 text-center text-xs text-slate-500 bg-darkpanel/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            RESTaurant API Simulator — Dirancang untuk materi perkuliahan HIMA TI CLUB 2026
          </span>
          <span className="font-mono text-slate-400">
            Client-Side Virtual Backend &bull; Dark Theme
          </span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        currentStepIndex={currentStepIndex}
        steps={simulation.steps}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
      />

      <LearningDrawer
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
};

export default App;
