'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [code, setCode] = useState('');
  const [downloadCode, setDownloadCode] = useState('');
  const [error, setError] = useState('');
  const [downloadError, setDownloadError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      
      if (response.ok) {
        setCode(data.code);
      } else {
        setError(data.error || '上传失败');
      }
    } catch (err) {
      setError('上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadCode) return;

    setDownloadError('');
    window.location.href = `/api/download/${downloadCode}`;
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">文件分享系统</h1>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">选择文件</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <button
            type="submit"
            disabled={!file || uploading}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
          >
            {uploading ? '上传中...' : '上传文件'}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">下载文件</h2>
          <form onSubmit={handleDownload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">输入下载码</label>
              <input
                type="text"
                value={downloadCode}
                onChange={(e) => setDownloadCode(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="请输入下载码"
              />
            </div>
            <button
              type="submit"
              disabled={!downloadCode}
              className="w-full bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
            >
              下载文件
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {downloadError && (
          <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
            {downloadError}
          </div>
        )}

        {code && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <p className="font-medium">文件上传成功！</p>
            <p className="mt-2">下载码：{code}</p>
            <a
              href={`/api/download/${code}`}
              className="mt-2 inline-block bg-green-500 text-white px-4 py-2 rounded"
            >
              下载文件
            </a>
          </div>
        )}
      </div>
    </main>
  );
} 