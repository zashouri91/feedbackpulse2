import React from 'react';
import { Mail, AlertCircle } from 'lucide-react';

const clients = [
  {
    name: 'Gmail',
    instructions: [
      'Open Gmail Settings (gear icon)',
      'Click "See all settings"',
      'Go to the "General" tab',
      'Scroll to "Signature"',
      'Create a new signature',
      'Paste your copied signature',
      'Save changes'
    ]
  },
  {
    name: 'Outlook',
    instructions: [
      'Open Outlook Settings',
      'Search for "Signature"',
      'Click "Email signature"',
      'Create a new signature',
      'Paste your copied signature',
      'Save'
    ]
  },
  {
    name: 'Apple Mail',
    instructions: [
      'Open Mail Preferences',
      'Click "Signatures"',
      'Click "+" to add a new signature',
      'Paste your copied signature',
      'Select the signature for your email account'
    ]
  }
];

export function EmailClientInstructions() {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">
              Before you begin
            </h4>
            <p className="mt-1 text-sm text-blue-700">
              Make sure you've copied your signature HTML using the "Copy Signature" button above.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <div
            key={client.name}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="font-medium text-gray-900">{client.name}</h3>
            </div>
            <ol className="space-y-2">
              {client.instructions.map((instruction, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {index + 1}. {instruction}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}