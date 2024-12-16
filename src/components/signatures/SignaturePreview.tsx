import React from 'react';
import { generateSignatureHtml } from '../../utils/signature';

interface SignaturePreviewProps {
  data: {
    name: string;
    title?: string;
    email: string;
    phone?: string;
    logo?: string;
    primaryColor: string;
    layout: 'vertical' | 'horizontal';
  };
  scale?: number;
}

export function SignaturePreview({ data, scale = 1 }: SignaturePreviewProps) {
  return (
    <div
      className="rounded-lg border bg-white p-4"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: generateSignatureHtml(data),
        }}
      />
    </div>
  );
}
