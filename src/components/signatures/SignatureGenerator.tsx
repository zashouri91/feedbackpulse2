import React from 'react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useAuthStore } from '../../store/authStore';

interface SignatureGeneratorProps {
  surveyId: string;
  ratingStyle?: 'stars' | 'smileys' | 'numbers';
  onRatingStyleChange?: (style: 'stars' | 'smileys' | 'numbers') => void;
}

export function SignatureGenerator({
  surveyId,
  ratingStyle = 'smileys',
  onRatingStyleChange,
}: SignatureGeneratorProps) {
  const [copied, setCopied] = React.useState(false);
  const { user } = useAuthStore();

  const baseUrl = window.location.origin;
  const trackingCode = btoa(
    JSON.stringify({
      surveyId,
      userId: user?.id,
      groupId: user?.groupId,
      locationId: user?.locationId,
      timestamp: new Date().toISOString(),
    })
  );

  const generateSignatureHtml = () => {
    const ratingIcons = {
      stars: Array(5)
        .fill(0)
        .map(
          (_, i) => `
        <a href="${baseUrl}/feedback/${trackingCode}/${i + 1}" style="text-decoration: none; color: #d1d5db;">
          <span style="font-size: 24px;">⭐</span>
        </a>
      `
        )
        .join(''),

      smileys: Array(5)
        .fill(0)
        .map(
          (_, i) => `
        <a href="${baseUrl}/feedback/${trackingCode}/${i + 1}" style="text-decoration: none;">
          <span style="font-size: 24px; color: ${
            i <= 1 ? '#ef4444' : i === 2 ? '#d97706' : '#22c55e'
          };">😊</span>
        </a>
      `
        )
        .join(''),

      numbers: Array(5)
        .fill(0)
        .map(
          (_, i) => `
        <a href="${baseUrl}/feedback/${trackingCode}/${i + 1}" style="text-decoration: none;">
          <span style="display: inline-block; width: 30px; height: 30px; line-height: 28px; text-align: center; border-radius: 50%; border: 2px solid #d1d5db; color: #374151; margin: 0 2px;">${i + 1}</span>
        </a>
      `
        )
        .join(''),
    };

    return `
      <table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color: #374151;">
        <tr>
          <td style="padding-bottom: 16px;">
            <div style="font-weight: bold; font-size: 16px;">${user?.name}</div>
            <div style="color: #6b7280; font-size: 14px;">${user?.email}</div>
          </td>
        </tr>
        <tr>
          <td style="padding-bottom: 16px;">
            <div style="margin-bottom: 8px; font-size: 14px;">How was your experience?</div>
            <div>${ratingIcons[ratingStyle]}</div>
          </td>
        </tr>
      </table>
    `;
  };

  const handleCopy = async () => {
    const signatureHtml = generateSignatureHtml();
    await navigator.clipboard.writeText(signatureHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Email Signature Preview</h3>

        <div className="mb-6">
          <Select
            label="Rating Style"
            value={ratingStyle}
            onChange={e => onRatingStyleChange?.(e.target.value as any)}
          >
            <option value="smileys">Smileys</option>
            <option value="stars">Stars</option>
            <option value="numbers">Numbers</option>
          </Select>
        </div>

        <div
          className="mb-4 rounded-lg border p-4"
          dangerouslySetInnerHTML={{ __html: generateSignatureHtml() }}
        />

        <Button onClick={handleCopy} className="w-full">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Signature HTML
            </>
          )}
        </Button>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="mb-2 text-sm font-medium text-blue-800">
          How to add this signature to your email client
        </h4>
        <ol className="list-inside list-decimal space-y-2 text-sm text-blue-700">
          <li>Copy the signature HTML using the button above</li>
          <li>Open your email client settings</li>
          <li>Find the signature settings section</li>
          <li>Create a new signature or edit an existing one</li>
          <li>Paste the copied HTML into the signature editor</li>
          <li>Save your changes</li>
        </ol>
      </div>
    </div>
  );
}
