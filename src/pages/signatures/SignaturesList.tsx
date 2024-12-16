import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { PlusIcon } from 'lucide-react';

export default function SignaturesList() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader title="Email Signatures" description="Manage your email signatures and templates">
        <button
          type="button"
          className="inline-flex items-center gap-x-2 rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="h-5 w-5" />
          New Signature
        </button>
      </PageHeader>

      <div className="mt-8">
        {/* Signature content will be implemented in the next iteration */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No signatures yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new signature template.
          </p>
        </div>
      </div>
    </div>
  );
}
