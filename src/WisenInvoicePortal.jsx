
import React, { useState } from 'react';

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

  const handleSendMessage = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      const message = e.target.value.trim();
      setChatHistory(prev => [...prev, { sender: 'user', message }]);
      e.target.value = '';
      setTimeout(() => {
        setChatHistory(prev => [...prev, { sender: 'ai', message: 'A WISEN asszisztens dolgozik a kérdéseden!' }]);
      }, 400);
    }
  };

  const handleOpenFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <header style={{ background: 'white', padding: '1rem', marginBottom: '1rem', borderRadius: '5px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
        <h1>WISEN Számlakezelő</h1>
      </header>
      <section style={{ marginBottom: '1rem' }}>
        <h2>📤 Számlafeltöltés (WISEN)</h2>
        <input type="file" multiple onChange={handleFileUpload} />
        {uploadedFiles.length > 0 && <p>{uploadedFiles.length} fájl feltöltve</p>}
        <button onClick={handleProcessFiles} disabled={loading}>
          {loading ? 'Feldolgozás folyamatban…' : 'Feldolgozás indítása'}
        </button>
      </section>
      <section style={{ marginBottom: '1rem' }}>
        <h2>📄 Feldolgozott számlák (WISEN)</h2>
        <table>
          <thead>
            <tr>
              <th>Számlaszám</th>
              <th>Partner</th>
              <th>Ország</th>
              <th>Közösségi adószám</th>
              <th>Nettó</th>
              <th>ÁFA</th>
              <th>Bruttó</th>
              <th>Deviza</th>
              <th>Státusz</th>
              <th>Számlakép</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row.invoiceNumber}</td>
                  <td>{row.partner}</td>
                  <td>{row.country}</td>
                  <td>{row.vatNumber}</td>
                  <td>{row.netAmount}</td>
                  <td>{row.vat}</td>
                  <td>{row.grossAmount}</td>
                  <td>{row.currency}</td>
                  <td>{row.status}</td>
                  <td><button onClick={() => handleOpenFile(row.fileUrl)}>📄 Megnyitás</button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="10" style={{ textAlign: 'center' }}>Nincs feldolgozott számla</td></tr>
            )}
          </tbody>
        </table>
      </section>
      <section>
        <h2>🤖 WISEN Adótanácsadó AI Chat</h2>
        <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '0.5rem', marginBottom: '0.5rem', maxHeight: '200px', overflowY: 'auto', background: 'white' }}>
          {chatHistory.map((chat, index) => (
            <p key={index}><strong>{chat.sender === 'ai' ? 'WISEN AI' : 'Te'}:</strong> {chat.message}</p>
          ))}
        </div>
        <input type="text" placeholder="Írj üzenetet és üss Entert..." onKeyDown={handleSendMessage} style={{ width: '100%', padding: '0.5rem' }} />
      </section>
    </div>
  );
}
