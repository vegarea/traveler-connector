import React from 'react';
import { WordPressConfigForm } from "@/components/admin/WordPressConfigForm";
import { TestUserCreationForm } from "@/components/admin/forms/TestUserCreationForm";

const WordPressConfig = () => {
  return (
    <div className="space-y-8">
      <WordPressConfigForm />
      <TestUserCreationForm />
    </div>
  );
};

export default WordPressConfig;