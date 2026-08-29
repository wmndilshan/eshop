import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SettingsProps {
  shop: {
    name: string;
    bio?: string | null;
    category: string;
    address: string;
    opening_hours?: string | null;
    website?: string | null;
  };
}

export function SettingsView({ shop }: SettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: shop.name,
      category: shop.category,
      bio: shop.bio || '',
      address: shop.address,
      opening_hours: shop.opening_hours || '',
      website: shop.website || '',
    },
  });

  const onSubmit = (data: any) => {
    // Show mock updates toast
    toast.success('Shop settings saved successfully (Mock)');
  };

  return (
    <div className="card max-w-2xl font-sans p-8 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[var(--eerie-black)] mb-1">Shop Profile Settings</h3>
        <p className="text-sm text-[var(--sonic-silver)]">Configure your public-facing storefront listing information.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Shop Name"
          type="text"
          error={errors.name?.message}
          {...register('name', { required: 'Shop name is required' })}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[var(--davys-gray)]">
            Shop Category
          </label>
          <select
            className="field w-full rounded-md border-[var(--cultured)] text-[var(--onyx)] px-3 focus:outline-none focus:border-[var(--salmon-pink)] focus:ring-1 focus:ring-[var(--salmon-pink)]"
            {...register('category', { required: 'Please select a shop category' })}
          >
            <option value="electronics">Electronics & Gadgets</option>
            <option value="fashion">Fashion & Clothing</option>
            <option value="crafts">Ceylon Handicrafts & Arts</option>
            <option value="groceries">Ceylon Tea & Groceries</option>
            <option value="health">Health & Beauty</option>
            <option value="other">Other Accessories</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-[var(--davys-gray)]">
            Shop Biography
          </label>
          <textarea
            className="w-full min-h-[90px] p-3 border border-[var(--cultured)] rounded-md text-[var(--onyx)] focus:outline-none focus:border-[var(--salmon-pink)] focus:ring-1 focus:ring-[var(--salmon-pink)] text-sm"
            {...register('bio', { required: 'Bio description is required' })}
          />
        </div>

        <Input
          label="Shop Physical Address"
          type="text"
          error={errors.address?.message}
          {...register('address', { required: 'Shop address is required' })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Opening Hours"
            type="text"
            error={errors.opening_hours?.message}
            {...register('opening_hours', { required: 'Opening hours are required' })}
          />
          <Input
            label="Website URL"
            type="url"
            error={errors.website?.message}
            {...register('website')}
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-[var(--cultured)]">
          <Button type="button" variant="outline" onClick={() => toast.success('Changes discarded')}>
            Discard
          </Button>
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
