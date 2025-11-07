
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, Grid, List, Type, MousePointer2, AlertCircle, 
  Tag, Square, Search, Table, Plus, Trash2, Settings,
  Copy, Move, ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  COMPONENT_LIBRARY,
  COMPONENT_LIBRARIES,
  ComponentBuilder,
  CanvasState,
  DroppedComponent,
  ComponentDefinition
} from '@/lib/app-component-builder';

interface DragDropCanvasProps {
  onCodeGenerated: (code: string) => void;
}

export default function DragDropCanvas({ onCodeGenerated }: DragDropCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<CanvasState>({
    components: [],
    selectedId: null,
    zoom: 1,
    gridSnap: true,
  });

  const [draggedComponent, setDraggedComponent] = useState<ComponentDefinition | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag start from component library
  const handleDragStart = (component: ComponentDefinition) => {
    setDraggedComponent(component);
    setIsDragging(true);
  };

  // Handle drop on canvas
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedComponent || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / canvas.zoom;
    let y = (e.clientY - rect.top) / canvas.zoom;

    // Snap to grid if enabled
    if (canvas.gridSnap) {
      const snapped = ComponentBuilder.snapToGrid(x, y);
      x = snapped.x;
      y = snapped.y;
    }

    const newComponent: DroppedComponent = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      componentId: draggedComponent.id,
      props: { ...draggedComponent.defaultProps },
      x,
      y,
      width: 200,
      height: 100,
    };

    setCanvas(prev => ({
      ...prev,
      components: [...prev.components, newComponent],
      selectedId: newComponent.id,
    }));

    setDraggedComponent(null);
    setIsDragging(false);
  };

  // Handle drag over canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Update prop value for selected component
  const updateComponentProp = (propName: string, value: any) => {
    if (!canvas.selectedId) return;

    setCanvas(prev => ({
      ...prev,
      components: prev.components.map(c =>
        c.id === canvas.selectedId
          ? { ...c, props: { ...c.props, [propName]: value } }
          : c
      ),
    }));
  };

  // Delete selected component
  const deleteSelectedComponent = () => {
    if (!canvas.selectedId) return;

    setCanvas(prev => ({
      ...prev,
      components: prev.components.filter(c => c.id !== canvas.selectedId),
      selectedId: null,
    }));
  };

  // Generate code
  const generateCode = () => {
    const code = ComponentBuilder.generateComponentCode(canvas);
    onCodeGenerated(code);
  };

  // Get selected component
  const selectedComponent = canvas.components.find(c => c.id === canvas.selectedId);
  const selectedDefinition = selectedComponent
    ? COMPONENT_LIBRARY[selectedComponent.componentId]
    : null;

  return (
    <div className="h-full flex gap-4">
      {/* Component Library */}
      <div className="w-72 bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Component Libraries</h3>

        <Tabs defaultValue="shadcn">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="shadcn" className="text-xs">shadcn/ui</TabsTrigger>
            <TabsTrigger value="daisyui" className="text-xs">DaisyUI</TabsTrigger>
          </TabsList>
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="flowbite" className="text-xs">Flowbite</TabsTrigger>
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
          </TabsList>

          {Object.entries(COMPONENT_LIBRARIES).map(([libId, library]) => (
            <TabsContent key={libId} value={libId} className="space-y-2">
              <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-600">{library.description}</p>
                {library.website && (
                  <a
                    href={library.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                  >
                    View Docs →
                  </a>
                )}
              </div>

              <ScrollArea className="h-[60vh]">
                <div className="space-y-2 pr-4">
                  {library.components.map(componentId => {
                    const component = COMPONENT_LIBRARY[componentId];
                    if (!component) return null;

                    const IconComponent = component.icon;
                    return (
                      <Card
                        key={component.id}
                        className="p-3 cursor-move hover:shadow-md transition-all"
                        draggable
                        onDragStart={() => handleDragStart(component)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <IconComponent size={20} className="text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{component.name}</h4>
                            <p className="text-xs text-gray-500 truncate">
                              {component.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Toolbar */}
        <div className="bg-white border border-gray-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setCanvas(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.1, 2) }))}>
              <ZoomIn size={16} />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCanvas(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.1, 0.5) }))}>
              <ZoomOut size={16} />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCanvas(prev => ({ ...prev, zoom: 1 }))}>
              <Maximize2 size={16} />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Label htmlFor="grid-snap" className="text-sm">Grid Snap</Label>
              <Switch
                id="grid-snap"
                checked={canvas.gridSnap}
                onCheckedChange={(checked) => setCanvas(prev => ({ ...prev, gridSnap: checked }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">{canvas.components.length} components</Badge>
            <Button size="sm" onClick={generateCode}>
              Generate Code
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-auto">
          <div
            ref={canvasRef}
            className="relative min-h-full min-w-full p-8"
            style={{ transform: `scale(${canvas.zoom})`, transformOrigin: 'top left' }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Grid background */}
            {canvas.gridSnap && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #E5E7EB 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
            )}

            {/* Dropped components */}
            {canvas.components.map(component => {
              const definition = COMPONENT_LIBRARY[component.componentId];
              if (!definition) return null;

              const IconComponent = definition.icon;
              const isSelected = canvas.selectedId === component.id;

              return (
                <div
                  key={component.id}
                  className={`absolute bg-white rounded-lg border-2 p-4 cursor-move transition-all ${
                    isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{
                    left: component.x,
                    top: component.y,
                    width: component.width,
                    minHeight: component.height,
                  }}
                  onClick={() => setCanvas(prev => ({ ...prev, selectedId: component.id }))}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <IconComponent size={16} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{definition.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {definition.preview}
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {canvas.components.length === 0 && !isDragging && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-400">
                  <Box size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Drag components here</p>
                  <p className="text-sm">Start building your app by dragging components from the library</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Properties</h3>

        {selectedComponent && selectedDefinition ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {React.createElement(selectedDefinition.icon, { size: 20, className: 'text-gray-600' })}
                <span className="font-medium">{selectedDefinition.name}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{selectedDefinition.description}</p>
            </div>

            <Separator />

            <ScrollArea className="h-96">
              <div className="space-y-4">
                {selectedDefinition.props.map(prop => (
                  <div key={prop.name} className="space-y-2">
                    <Label htmlFor={prop.name}>{prop.label}</Label>
                    
                    {prop.type === 'string' && (
                      <Input
                        id={prop.name}
                        value={selectedComponent.props[prop.name] || ''}
                        onChange={(e) => updateComponentProp(prop.name, e.target.value)}
                        placeholder={prop.description}
                      />
                    )}

                    {prop.type === 'number' && (
                      <Input
                        id={prop.name}
                        type="number"
                        value={selectedComponent.props[prop.name] || 0}
                        onChange={(e) => updateComponentProp(prop.name, parseInt(e.target.value))}
                      />
                    )}

                    {prop.type === 'boolean' && (
                      <div className="flex items-center gap-2">
                        <Switch
                          id={prop.name}
                          checked={selectedComponent.props[prop.name] || false}
                          onCheckedChange={(checked) => updateComponentProp(prop.name, checked)}
                        />
                        <Label htmlFor={prop.name} className="text-sm text-gray-500">
                          {prop.description}
                        </Label>
                      </div>
                    )}

                    {prop.type === 'select' && prop.options && (
                      <Select
                        value={selectedComponent.props[prop.name] || prop.default}
                        onValueChange={(value) => updateComponentProp(prop.name, value)}
                      >
                        <SelectTrigger id={prop.name}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {prop.options.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {prop.type === 'color' && (
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={selectedComponent.props[prop.name] || '#000000'}
                          onChange={(e) => updateComponentProp(prop.name, e.target.value)}
                          className="w-16 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={selectedComponent.props[prop.name] || '#000000'}
                          onChange={(e) => updateComponentProp(prop.name, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  // Duplicate component
                  const newComponent: DroppedComponent = {
                    ...selectedComponent,
                    id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    x: selectedComponent.x + 20,
                    y: selectedComponent.y + 20,
                  };
                  setCanvas(prev => ({
                    ...prev,
                    components: [...prev.components, newComponent],
                    selectedId: newComponent.id,
                  }));
                }}
              >
                <Copy size={16} className="mr-2" />
                Duplicate
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteSelectedComponent}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <div className="text-center">
              <Settings size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">Select a component to edit properties</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
