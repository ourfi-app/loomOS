
'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Database, Code, FileCode, Download, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  DatabaseSchema, 
  SchemaModel, 
  SchemaField, 
  SchemaGenerator 
} from '@/lib/app-schema-generator';

interface SchemaBuilderProps {
  appName: string;
  onSchemaGenerated?: (schema: DatabaseSchema) => void;
}

export default function SchemaBuilder({ appName, onSchemaGenerated }: SchemaBuilderProps) {
  const [schema, setSchema] = useState<DatabaseSchema>({
    models: [
      {
        name: appName.replace(/\s+/g, ''),
        fields: [
          { name: 'id', type: 'String', required: true, unique: true, default: 'uuid()' },
          { name: 'createdAt', type: 'DateTime', required: true, unique: false, default: 'now()' },
          { name: 'updatedAt', type: 'DateTime', required: true, unique: false, default: 'now()' },
        ],
        indexes: ['createdAt'],
      },
    ],
    enums: [],
  });

  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [newFieldName, setNewFieldName] = useState('');

  const selectedModel = schema.models[selectedModelIndex];

  // Add a new field
  const addField = () => {
    if (!newFieldName.trim()) {
      toast.error('Please enter a field name');
      return;
    }

    const newField: SchemaField = {
      name: newFieldName,
      type: 'String',
      required: false,
      unique: false,
    };

    setSchema(prev => ({
      ...prev,
      models: prev.models.map((model, idx) =>
        idx === selectedModelIndex
          ? { ...model, fields: [...model.fields, newField] }
          : model
      ),
    }));

    setNewFieldName('');
    toast.success('Field added');
  };

  // Update field property
  const updateField = (fieldIndex: number, updates: Partial<SchemaField>) => {
    setSchema(prev => ({
      ...prev,
      models: prev.models.map((model, idx) =>
        idx === selectedModelIndex
          ? {
              ...model,
              fields: model.fields.map((field, fIdx) =>
                fIdx === fieldIndex ? { ...field, ...updates } : field
              ),
            }
          : model
      ),
    }));
  };

  // Delete field
  const deleteField = (fieldIndex: number) => {
    setSchema(prev => ({
      ...prev,
      models: prev.models.map((model, idx) =>
        idx === selectedModelIndex
          ? { ...model, fields: model.fields.filter((_, fIdx) => fIdx !== fieldIndex) }
          : model
      ),
    }));
    toast.success('Field deleted');
  };

  // Add new model
  const addModel = () => {
    const newModel: SchemaModel = {
      name: `New Model ${schema.models.length + 1}`,
      fields: [
        { name: 'id', type: 'String', required: true, unique: true, default: 'uuid()' },
        { name: 'createdAt', type: 'DateTime', required: true, unique: false, default: 'now()' },
      ],
    };

    setSchema(prev => ({ ...prev, models: [...prev.models, newModel] }));
    setSelectedModelIndex(schema.models.length);
    toast.success('Model added');
  };

  // Generate schemas
  const generatePrismaSchema = () => {
    const prismaSchema = SchemaGenerator.generatePrismaSchema(schema);
    downloadFile(prismaSchema, 'schema.prisma');
  };

  const generateTypeScript = () => {
    const tsTypes = SchemaGenerator.generateTypeScript(schema);
    downloadFile(tsTypes, 'types.ts');
  };

  const generateMigration = () => {
    const sql = SchemaGenerator.generateMigrationSQL(schema);
    downloadFile(sql, 'migration.sql');
  };

  const generateAPIRoutes = () => {
    if (!selectedModel) return;
    const routes = SchemaGenerator.generateCRUDRoutes(selectedModel.name);
    const routeFile = Object.entries(routes).map(([method, code]) => 
      `// ${method}\n${code}\n\n`
    ).join('');
    downloadFile(routeFile, `${selectedModel.name.toLowerCase()}-routes.ts`);
  };

  // Download helper
  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  // Validate schema
  const validation = SchemaGenerator.validateSchema(schema);

  return (
    <div className="h-full flex gap-4">
      {/* Models List */}
      <div className="w-64 bg-white border border-[var(--semantic-border-light)] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Models</h3>
          <Button size="sm" onClick={addModel}>
            <Plus size={16} />
          </Button>
        </div>

        <ScrollArea className="h-96">
          <div className="space-y-2">
            {schema.models.map((model, idx) => (
              <Card
                key={idx}
                className={`p-3 cursor-pointer transition-all ${
                  selectedModelIndex === idx ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedModelIndex(idx)}
              >
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-[var(--semantic-text-secondary)]" />
                  <span className="font-medium text-sm">{model.name}</span>
                </div>
                <p className="text-xs text-[var(--semantic-text-tertiary)] mt-1">
                  {model.fields.length} fields
                </p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Schema Editor */}
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database size={20} />
              {selectedModel?.name || 'No Model Selected'}
            </CardTitle>
            <CardDescription>
              Define your database schema and generate code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="fields">
              <TabsList>
                <TabsTrigger value="fields">Fields</TabsTrigger>
                <TabsTrigger value="indexes">Indexes</TabsTrigger>
                <TabsTrigger value="relations">Relations</TabsTrigger>
              </TabsList>

              <TabsContent value="fields" className="space-y-4">
                {/* Add Field */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Field name"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addField()}
                  />
                  <Button onClick={addField}>
                    <Plus size={16} className="mr-2" />
                    Add Field
                  </Button>
                </div>

                <Separator />

                {/* Fields List */}
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {selectedModel?.fields.map((field, fieldIdx) => (
                      <Card key={fieldIdx} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Input
                              value={field.name}
                              onChange={(e) => updateField(fieldIdx, { name: e.target.value })}
                              className="font-mono text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteField(fieldIdx)}
                              disabled={['id', 'createdAt', 'updatedAt'].includes(field.name)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Type</Label>
                              <Select
                                value={field.type}
                                onValueChange={(value: any) => updateField(fieldIdx, { type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="String">String</SelectItem>
                                  <SelectItem value="Int">Int</SelectItem>
                                  <SelectItem value="Float">Float</SelectItem>
                                  <SelectItem value="Boolean">Boolean</SelectItem>
                                  <SelectItem value="DateTime">DateTime</SelectItem>
                                  <SelectItem value="Json">Json</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Default</Label>
                              <Input
                                value={field.default || ''}
                                onChange={(e) => updateField(fieldIdx, { default: e.target.value })}
                                placeholder="Optional"
                                className="text-sm"
                              />
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={field.required}
                                onCheckedChange={(checked) => updateField(fieldIdx, { required: checked })}
                                disabled={['id', 'createdAt', 'updatedAt'].includes(field.name)}
                              />
                              <Label className="text-xs">Required</Label>
                            </div>

                            <div className="flex items-center gap-2">
                              <Switch
                                checked={field.unique}
                                onCheckedChange={(checked) => updateField(fieldIdx, { unique: checked })}
                              />
                              <Label className="text-xs">Unique</Label>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="indexes" className="py-4">
                <div className="text-center text-[var(--semantic-text-tertiary)] py-8">
                  <p>Index configuration coming soon</p>
                </div>
              </TabsContent>

              <TabsContent value="relations" className="py-4">
                <div className="text-center text-[var(--semantic-text-tertiary)] py-8">
                  <p>Relations configuration coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Actions Panel */}
      <div className="w-80 bg-white border border-[var(--semantic-border-light)] rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Generate Code</h3>

        {!validation.valid && (
          <div className="mb-4 p-3 bg-[var(--semantic-error-bg)] border border-[var(--semantic-error-border)] rounded-lg">
            <div className="flex items-start gap-2 text-[var(--semantic-error-dark)]">
              <AlertCircle size={16} className="mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">Schema Errors:</p>
                <ul className="text-xs space-y-1">
                  {validation.errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {validation.valid && (
          <div className="mb-4 p-3 bg-[var(--semantic-success-bg)] border border-[var(--semantic-success-bg)] rounded-lg">
            <div className="flex items-center gap-2 text-[var(--semantic-success-dark)]">
              <Check size={16} />
              <p className="text-sm font-medium">Schema is valid</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={generatePrismaSchema}
            disabled={!validation.valid}
          >
            <Database size={16} className="mr-2" />
            Prisma Schema
          </Button>

          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={generateTypeScript}
            disabled={!validation.valid}
          >
            <FileCode size={16} className="mr-2" />
            TypeScript Types
          </Button>

          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={generateMigration}
            disabled={!validation.valid}
          >
            <Code size={16} className="mr-2" />
            Migration SQL
          </Button>

          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={generateAPIRoutes}
            disabled={!validation.valid || !selectedModel}
          >
            <Download size={16} className="mr-2" />
            API Routes
          </Button>
        </div>

        <Separator className="my-6" />

        <div>
          <h4 className="text-sm font-semibold mb-3">Schema Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--semantic-text-secondary)]">Models:</span>
              <Badge variant="secondary">{schema.models.length}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--semantic-text-secondary)]">Total Fields:</span>
              <Badge variant="secondary">
                {schema.models.reduce((sum, m) => sum + m.fields.length, 0)}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--semantic-text-secondary)]">Enums:</span>
              <Badge variant="secondary">{schema.enums?.length || 0}</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
