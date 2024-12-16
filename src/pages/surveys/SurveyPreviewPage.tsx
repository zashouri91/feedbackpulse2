import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { SurveyPreview } from '../../components/surveys/SurveyPreview';
import { SignatureGenerator } from '../../components/signatures/SignatureGenerator';
import { useSurveys } from '../../hooks/useSurveys';

export default function SurveyPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { surveys, isLoading } = useSurveys();
  const [ratingStyle, setRatingStyle] = useState<'stars' | 'smileys' | 'numbers'>('smileys');

  const survey = surveys.find(s => s.id === id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Survey not found</h2>
        <p className="mt-2 text-gray-600">The survey you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Survey Preview</h1>
        <p className="mt-2 text-sm text-gray-700">
          Preview how your survey will look and generate email signatures.
        </p>
      </div>

      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Survey Preview</TabsTrigger>
          <TabsTrigger value="signature">Email Signature</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-6">
          <SurveyPreview survey={survey} ratingStyle={ratingStyle} />
        </TabsContent>

        <TabsContent value="signature" className="mt-6">
          <SignatureGenerator
            surveyId={survey.id}
            ratingStyle={ratingStyle}
            onRatingStyleChange={setRatingStyle}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
