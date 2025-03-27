// UploadAgentModal.tsx
'use client';

import { useState, FormEvent } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';

interface Category {
  id: string;
  name: string;
}

interface TranslationsType {
  uploadAgent: string;
  agentName: string;
  category: string;
  selectCategory: string;
  description: string;
  price: string;
  pricePerUse: string;
  tags: string;
  commaSeparated: string;
  abilities: string;
  walletAddress: string;
  upload: string;
  cancel: string;
}

interface FormDataType {
  name: string;
  category: string;
  description: string;
  price: string;
  tags: string;
  abilities: string;
  imageUrl: string;
  walletAddress: string;
}

interface UploadAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  categories: Category[];
  translations: TranslationsType;
}

export default function UploadAgentModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  translations,
}: UploadAgentModalProps) {
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    category: '',
    description: '',
    price: '',
    tags: '',
    abilities: '',
    imageUrl: '',
    walletAddress: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Process tags and abilities as arrays
    const processedData = {
      ...formData,
      rating: 0,
      reviews: 0,
      tags: formData.tags.split(',').map((tag) => tag.trim()),
      abilities: formData.abilities.split(',').map((ability) => ability.trim()),
      price: parseFloat(formData.price),
      popular: false,
    };

    onSubmit(processedData);

    // Reset form
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      tags: '',
      abilities: '',
      imageUrl: '',
      walletAddress: '',
    });

    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed top-[60%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-xl focus:outline-none overflow-y-auto">
          <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
            {translations.uploadAgent}
          </Dialog.Title>

          <Form.Root onSubmit={handleSubmit} className="space-y-4">
            <Form.Field name="name" className="grid gap-2">
              <Form.Label className="font-medium text-sm text-gray-700">
                {translations.agentName}
              </Form.Label>
              <Form.Control asChild>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  name="name"
                />
              </Form.Control>
            </Form.Field>

            <div className="grid gap-2">
              <label className="font-medium text-sm text-gray-700">
                {translations.category}
              </label>
              <Select.Root
                onValueChange={handleSelectChange}
                value={formData.category}
              >
                <Select.Trigger className="inline-flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
                  <Select.Value placeholder={translations.selectCategory} />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content className="overflow-hidden bg-white rounded-md shadow-lg">
                    <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white">
                      <ChevronUpIcon />
                    </Select.ScrollUpButton>

                    <Select.Viewport className="p-1">
                      {categories
                        .filter((cat) => cat.id !== 'all')
                        .map((category) => (
                          <Select.Item
                            key={category.id}
                            value={category.id}
                            className="relative flex items-center h-8 px-6 py-2 rounded-sm text-sm hover:bg-blue-100 focus:outline-none cursor-pointer"
                          >
                            <Select.ItemText>{category.name}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-1 inline-flex items-center">
                              <CheckIcon />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                    </Select.Viewport>

                    <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white">
                      <ChevronDownIcon />
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <Form.Field name="description" className="grid gap-2">
              <Form.Label className="font-medium text-sm text-gray-700">
                {translations.description}
              </Form.Label>
              <Form.Control asChild>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-24"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  name="description"
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="price" className="grid gap-2">
              <Form.Label className="font-medium text-sm text-gray-700">
                {translations.price} ({translations.pricePerUse})
              </Form.Label>
              <Form.Control asChild>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  name="price"
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="walletAddress" className="grid gap-2">
              <Form.Label className="font-medium text-sm text-gray-700">
                {translations.walletAddress}
              </Form.Label>
              <Form.Control asChild>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  type="text"
                  required
                  value={formData.walletAddress}
                  onChange={handleChange}
                  name="walletAddress"
                  placeholder="0x1234..."
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="tags" className="grid gap-2">
              <Form.Label className="font-medium text-sm text-gray-700">
                {translations.tags} ({translations.commaSeparated})
              </Form.Label>
              <Form.Control asChild>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  type="text"
                  required
                  value={formData.tags}
                  onChange={handleChange}
                  name="tags"
                  placeholder="DeFi, Staking, Yield"
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="abilities" className="grid gap-2">
              <Form.Label className="font-medium text-sm text-gray-700">
                {translations.abilities} ({translations.commaSeparated})
              </Form.Label>
              <Form.Control asChild>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  type="text"
                  required
                  value={formData.abilities}
                  onChange={handleChange}
                  name="abilities"
                  placeholder="Staking Management, Yield Optimization, Protocol Integration"
                />
              </Form.Control>
            </Form.Field>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {translations.cancel}
              </button>
              <Form.Submit className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {translations.upload}
              </Form.Submit>
            </div>
          </Form.Root>

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100">
              <Cross2Icon className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
