
// ✅ WISEN brandre optimalizált verzió: Multi-upload + bővített táblázat

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function WisenInvoicePortal() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', message: 'Szia! Ez a WISEN asszisztens. Segítsek a számlák feldolgozásában?' }
  ]);

  const mockProcessFiles = (files) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const processedData = files.map((file, index) => ({
          invoiceNumber: `INV-${1000 + index}`,
          partner: `Demo Partner ${index + 1} Kft.`,
          country: 'HU',
          vatNumber: `HU1234567${index}`,
          netAmount: (200 + index * 10).toFixed(2),
          vat: (50 + index * 5).toFixed(2),
          grossAmount: (250 + index * 15).toFixed(2),
          currency: 'EUR',
          status: '✅ Kész',
          fileUrl: URL.createObjectURL(file)
        }));
        resolve(processedData);
      }, 500);
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(files);
  };

  const handleProcessFiles = async () => {
    if (uploadedFiles.length > 0) {
      setLoading(true);
      const extractedData = await mockProcessFiles(uploadedFiles);
      setTableData(extractedData);
      setLoading(false);
    }
  };

  const handleSendMessage = (message) => {
    if (message.trim() !== '') {
      setChatHistory((prev) => [...prev, { sender: 'user', message }]);
      setTimeout(() => {
        setChatHistory((prev) => [...prev, { sender: 'ai', message: 'A WISEN asszisztens dolgozik a kérdéseden!' }]);
      }, 400);
    }
  };

  const handleOpenFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#005bbb] min-h-screen">
      <header className="flex items-center justify-between bg-white p-4 shadow rounded">
        <img src="/wisen_logo.svg" alt="WISEN logo" className="h-10" />
        <h1 className="text-2xl font-bold text-[#005bbb]">WISEN Számlakezelő</h1>
      </header>
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold">📤 Számlafeltöltés (WISEN)</h2>
            <Input type="file" multiple onChange={handleFileUpload} />
            {uploadedFiles.length > 0 && (
              <Badge variant="secondary">
                {uploadedFiles.length} fájl feltöltve
              </Badge>
            )}
            <Button
              className="w-full bg-[#005bbb] text-white"
              onClick={handleProcessFiles}
              disabled={loading}
            >
              {loading ? 'Feldolgozás folyamatban…' : 'Feldolgozás indítása'}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold">📄 Feldolgozott számlák (WISEN)</h2>
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Számlaszám</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Ország</TableHead>
                    <TableHead>Közösségi adószám</TableHead>
                    <TableHead>Nettó</TableHead>
                    <TableHead>ÁFA</TableHead>
                    <TableHead>Bruttó</TableHead>
                    <TableHead>Deviza</TableHead>
                    <TableHead>Státusz</TableHead>
                    <TableHead>Számlakép</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.length > 0 ? (
                    tableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.invoiceNumber}</TableCell>
                        <TableCell>{row.partner}</TableCell>
                        <TableCell>{row.country}</TableCell>
                        <TableCell>{row.vatNumber}</TableCell>
                        <TableCell>{row.netAmount}</TableCell>
                        <TableCell>{row.vat}</TableCell>
                        <TableCell>{row.grossAmount}</TableCell>
                        <TableCell>{row.currency}</TableCell>
                        <TableCell><Badge variant="success">{row.status}</Badge></TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleOpenFile(row.fileUrl)}>📄 Megnyitás</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="10" className="text-center">Nincs feldolgozott számla</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
            <Button className="w-full mt-4 bg-[#005bbb] text-white">NAV XML + Számlakép párosítás</Button>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <Card>
          <CardContent>
            <h2 className="text-xl font-bold">🤖 WISEN Adótanácsadó AI Chat</h2>
            <div className="space-y-2 border p-2 rounded h-64 overflow-y-auto bg-white">
              {chatHistory.map((chat, index) => (
                <div key={index} className={chat.sender === 'ai' ? 'text-[#005bbb]' : 'text-gray-800'}>
                  <strong>{chat.sender === 'ai' ? 'WISEN AI' : 'Te'}:</strong> {chat.message}
                </div>
              ))}
            </div>
            <Textarea placeholder="Írj üzenetet a WISEN AI-nak..." onBlur={(e) => handleSendMessage(e.target.value)} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
