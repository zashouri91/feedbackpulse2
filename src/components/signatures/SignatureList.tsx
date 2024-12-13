import React, { useState } from 'react';
import { Plus, Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { SignatureCard } from './SignatureCard';
import { SignatureDesigner } from './SignatureDesigner';
import { useSignatures } from '../../hooks/useSignatures';

export function SignatureList() {
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const { signatures, isLoading, addSignature } = useSignatures();

  const handleCreate = async (data: any) => {
    await addSignature(data);
    setIsDesignerOpen(false);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Email Signatures</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage your feedback-enabled email signatures.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button onClick={() => setIsDesignerOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Signature
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : signatures.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No signatures</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new signature.</p>
            <div className="mt-6">
              <Button onClick={() => setIsDesignerOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Signature
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signatures.map((signature) => (
              <SignatureCard
                key={signature.id}
                signature={signature}
              />
            ))}
          </div>
        )}
      </div>

      {isDesignerOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <SignatureDesigner onSubmit={handleCreate} onCancel={() => setIsDesignerOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}