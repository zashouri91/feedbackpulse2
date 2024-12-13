import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { SignaturePreview } from './SignaturePreview';
import { generateSignatureHtml } from '../../utils/signature';
import type { Signature } from '../../types/signature';

interface SignatureCardProps {
  signature: Signature;
}

export function SignatureCard({ signature }: SignatureCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const html = generateSignatureHtml({
      ...signature.style,
      trackingCode: signature.trackingCode
    });
    
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <SignaturePreview data={signature.style} scale={0.8} />
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy HTML
            </>
          )}
        </Button>
      </div>
    </div>
  );
}