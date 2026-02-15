import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";

interface ColumnMapping {
  csvHeader: string;
  dbField: string;
}

interface CsvImportModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (rows: Record<string, string>[]) => Promise<void>;
  targetFields: { key: string; label: string; required?: boolean }[];
  title: string;
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine).filter(r => r.some(c => c));
  return { headers, rows };
}

function autoMapColumns(csvHeaders: string[], targetFields: { key: string; label: string }[]): ColumnMapping[] {
  const mappings: ColumnMapping[] = [];
  const synonyms: Record<string, string[]> = {
    name: ["name", "full name", "customer name", "client name", "author", "reviewer"],
    email: ["email", "e-mail", "email address", "mail"],
    phone: ["phone", "phone number", "tel", "telephone", "mobile", "cell"],
    vehicle: ["vehicle", "car", "auto", "automobile"],
    notes: ["notes", "note", "comments", "comment", "description"],
    status: ["status", "state", "type"],
    content: ["content", "review", "text", "testimonial", "feedback", "comment", "message"],
    rating: ["rating", "stars", "score", "rate"],
    total_spent: ["total spent", "spent", "revenue", "amount", "total"],
    total_bookings: ["total bookings", "bookings", "visits", "appointments"],
  };

  for (const csvHeader of csvHeaders) {
    const lower = csvHeader.toLowerCase().trim();
    let matched = false;
    for (const field of targetFields) {
      const fieldSynonyms = synonyms[field.key] || [field.key, field.label.toLowerCase()];
      if (fieldSynonyms.some(s => lower.includes(s) || s.includes(lower))) {
        mappings.push({ csvHeader, dbField: field.key });
        matched = true;
        break;
      }
    }
    if (!matched) {
      mappings.push({ csvHeader, dbField: "" });
    }
  }
  return mappings;
}

const CsvImportModal = ({ open, onClose, onImport, targetFields, title }: CsvImportModalProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"upload" | "map" | "importing" | "done">("upload");
  const [csvData, setCsvData] = useState<{ headers: string[]; rows: string[][] }>({ headers: [], rows: [] });
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [importResult, setImportResult] = useState({ success: 0, errors: 0 });

  if (!open) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.headers.length === 0) return;
      setCsvData(parsed);
      setMappings(autoMapColumns(parsed.headers, targetFields));
      setStep("map");
    };
    reader.readAsText(file);
  };

  const updateMapping = (csvHeader: string, dbField: string) => {
    setMappings(prev => prev.map(m => m.csvHeader === csvHeader ? { ...m, dbField } : m));
  };

  const handleImport = async () => {
    setStep("importing");
    const rows: Record<string, string>[] = csvData.rows.map(row => {
      const obj: Record<string, string> = {};
      mappings.forEach((m, i) => {
        if (m.dbField && row[i] !== undefined) {
          obj[m.dbField] = row[i];
        }
      });
      return obj;
    }).filter(obj => Object.keys(obj).length > 0);

    try {
      await onImport(rows);
      setImportResult({ success: rows.length, errors: 0 });
    } catch {
      setImportResult({ success: 0, errors: rows.length });
    }
    setStep("done");
  };

  const requiredMapped = targetFields
    .filter(f => f.required)
    .every(f => mappings.some(m => m.dbField === f.key));

  const reset = () => {
    setStep("upload");
    setCsvData({ headers: [], rows: [] });
    setMappings([]);
    setImportResult({ success: 0, errors: 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 p-6 space-y-4 max-h-[85vh] overflow-y-auto" style={{ background: "linear-gradient(180deg, hsl(215 50% 12%) 0%, hsl(217 33% 10%) 100%)" }}>
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button onClick={reset} className="text-white/30 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {step === "upload" && (
          <div className="space-y-4">
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-accent/40 rounded-xl p-8 text-center cursor-pointer transition-colors"
            >
              <Upload className="w-8 h-8 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm">Click to upload a CSV file</p>
              <p className="text-white/30 text-xs mt-1">Columns will be auto-detected</p>
            </div>
            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
          </div>
        )}

        {step === "map" && (
          <div className="space-y-4">
            <p className="text-white/50 text-sm">
              Found <span className="text-accent font-medium">{csvData.rows.length}</span> rows and <span className="text-accent font-medium">{csvData.headers.length}</span> columns. Map them to the correct fields:
            </p>
            <div className="space-y-2">
              {mappings.map(m => (
                <div key={m.csvHeader} className="flex items-center gap-3">
                  <div className="flex-1 text-sm text-white/70 truncate flex items-center gap-2">
                    <FileText className="w-3 h-3 text-white/30 shrink-0" />
                    {m.csvHeader}
                  </div>
                  <span className="text-white/30 text-xs">→</span>
                  <div className="relative flex-1">
                    <select
                      value={m.dbField}
                      onChange={e => updateMapping(m.csvHeader, e.target.value)}
                      className="w-full h-9 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs px-3 pr-8 focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
                    >
                      <option value="" className="bg-[hsl(215,50%,10%)]">Skip</option>
                      {targetFields.map(f => (
                        <option key={f.key} value={f.key} className="bg-[hsl(215,50%,10%)]">
                          {f.label}{f.required ? " *" : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-white/30 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
            {/* Preview */}
            {csvData.rows.length > 0 && (
              <div className="rounded-lg border border-white/10 overflow-hidden">
                <div className="text-xs text-white/30 px-3 py-1.5 bg-white/5">Preview (first 3 rows)</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        {mappings.filter(m => m.dbField).map(m => (
                          <th key={m.csvHeader} className="text-left text-white/50 px-3 py-1.5 font-medium">
                            {targetFields.find(f => f.key === m.dbField)?.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.rows.slice(0, 3).map((row, i) => (
                        <tr key={i} className="border-t border-white/5">
                          {mappings.filter(m => m.dbField).map((m, j) => {
                            const idx = csvData.headers.indexOf(m.csvHeader);
                            return <td key={j} className="text-white/60 px-3 py-1.5 truncate max-w-[150px]">{row[idx] || ""}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <Button
              onClick={handleImport}
              disabled={!requiredMapped}
              className="w-full h-11"
              style={{ background: requiredMapped ? "linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(217 91% 50%) 100%)" : undefined }}
            >
              Import {csvData.rows.length} Records
            </Button>
          </div>
        )}

        {step === "importing" && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white/50 text-sm">Importing records...</p>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-6 space-y-3">
            {importResult.success > 0 ? (
              <>
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-white font-medium">Successfully imported {importResult.success} records!</p>
              </>
            ) : (
              <>
                <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
                <p className="text-white font-medium">Import failed. Please check your CSV format.</p>
              </>
            )}
            <Button onClick={reset} variant="outline" className="border-white/10 text-foreground hover:bg-white/5">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsvImportModal;
