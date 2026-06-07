import React, { useEffect, useMemo, useState } from 'react';
import { ThemeProvider } from '@patternize/components';
import { Moon, Sun, Boxes, Sparkles } from 'lucide-react';
import catalog from '../../catalog.json';
import { renderComponent } from './registry';
import { cn, hexToHslString } from './lib/utils';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Tabs, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';

interface PropSpec {
  name: string;
  type: string;
  required?: boolean;
  description: string;
}
interface Example {
  name: string;
  props: Record<string, unknown>;
}
interface CatalogComponent {
  id: string;
  category: string;
  atomic?: boolean;
  import: string;
  description: string;
  composedOf?: string[];
  entry?: string;
  peerDependencies?: string[];
  props: PropSpec[];
  examples: Example[];
}
interface Catalog {
  name: string;
  version: string;
  description: string;
  components: CatalogComponent[];
}

const data = catalog as unknown as Catalog;

const THEME_PRESETS: { name: string; hex: string }[] = [
  { name: 'Green', hex: '#20bf6b' },
  { name: 'Blue', hex: '#4a90e2' },
  { name: 'Violet', hex: '#7c5cff' },
  { name: 'Amber', hex: '#f7b731' },
  { name: 'Rose', hex: '#eb3b5a' },
  { name: 'Teal', hex: '#0fb9b1' }
];

const CATEGORY_LABELS: Record<string, string> = {
  theme: 'Theme',
  ml: 'Machine Learning',
  algorithms: 'Data Structures'
};

export default function App() {
  const [selectedId, setSelectedId] = useState('QKVProjection');
  const [primary, setPrimary] = useState('#20bf6b');
  const [dark, setDark] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', hexToHslString(primary));
  }, [primary]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const grouped = useMemo(() => {
    const map: Record<string, CatalogComponent[]> = {};
    for (const c of data.components) {
      (map[c.category] ??= []).push(c);
    }
    return map;
  }, []);

  const selected = data.components.find((c) => c.id === selectedId)!;
  const example = selected.examples[Math.min(exampleIndex, selected.examples.length - 1)];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Boxes className="h-5 w-5 text-primary" />
          <div>
            <div className="text-sm font-semibold leading-tight">
              Patternize · Workbench
            </div>
            <div className="text-xs text-muted-foreground">
              {data.name} v{data.version}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {THEME_PRESETS.map((p) => (
              <button
                key={p.hex}
                title={p.name}
                onClick={() => setPrimary(p.hex)}
                className={cn(
                  'h-6 w-6 rounded-full border-2 transition-transform hover:scale-110',
                  primary === p.hex ? 'border-foreground' : 'border-transparent'
                )}
                style={{ background: p.hex }}
              />
            ))}
            <input
              type="color"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="h-6 w-8 cursor-pointer rounded border border-border bg-transparent"
              title="Custom primary color"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setDark((d) => !d)}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="w-60 shrink-0 overflow-y-auto border-r border-border p-3">
          {Object.entries(grouped).map(([category, comps]) => (
            <div key={category} className="mb-4">
              <div className="mb-1.5 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {CATEGORY_LABELS[category] ?? category}
              </div>
              <div className="flex flex-col gap-0.5">
                {comps.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedId(c.id);
                      setExampleIndex(0);
                    }}
                    className={cn(
                      'flex items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                      selectedId === c.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    )}
                  >
                    <span>{c.id}</span>
                    {c.atomic && (
                      <Sparkles
                        className={cn(
                          'h-3 w-3',
                          selectedId === c.id
                            ? 'text-primary-foreground'
                            : 'text-muted-foreground'
                        )}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-5xl flex-col gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{selected.id}</h1>
                {selected.atomic ? (
                  <Badge>atomic</Badge>
                ) : (
                  <Badge>composed</Badge>
                )}
                <Badge>{CATEGORY_LABELS[selected.category] ?? selected.category}</Badge>
              </div>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                {selected.description}
              </p>
              {selected.composedOf && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Composed of: {selected.composedOf.join(', ')}
                </p>
              )}
            </div>

            {/* Preview */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-sm">Preview</CardTitle>
                {selected.examples.length > 1 && (
                  <Tabs
                    value={String(exampleIndex)}
                    onValueChange={(v) => setExampleIndex(Number(v))}
                  >
                    <TabsList>
                      {selected.examples.map((ex, i) => (
                        <TabsTrigger key={i} value={String(i)}>
                          {ex.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}
              </CardHeader>
              <CardContent>
                <div className="preview-stage flex min-h-[280px] items-center justify-center overflow-auto rounded-md border border-border p-6">
                  <ThemeProvider primary={primary} options={{ dark }}>
                    {renderComponent(selected.id, example.props)}
                  </ThemeProvider>
                </div>
              </CardContent>
            </Card>

            {/* Usage */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Usage</CardTitle>
                  <CardDescription>Import and example props</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
                    <code>{selected.import + ';'}</code>
                  </pre>
                  <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
                    <code>
                      {`<${selected.id} ${formatProps(example.props)} />`}
                    </code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Props</CardTitle>
                  <CardDescription>{selected.props.length} props</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col divide-y divide-border">
                    {selected.props.map((p) => (
                      <div key={p.name} className="py-1.5">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-semibold">{p.name}</code>
                          {p.required && (
                            <span className="text-[10px] uppercase text-primary">
                              required
                            </span>
                          )}
                          <code className="text-[11px] text-muted-foreground">
                            {p.type}
                          </code>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {p.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function formatProps(props: Record<string, unknown>): string {
  return Object.entries(props)
    .map(([k, v]) => {
      if (typeof v === 'string') return `${k}="${v}"`;
      if (typeof v === 'boolean') return v ? k : `${k}={false}`;
      return `${k}={${JSON.stringify(v)}}`;
    })
    .join('\n  ')
    .replace(/^/, '\n  ')
    .concat('\n');
}
