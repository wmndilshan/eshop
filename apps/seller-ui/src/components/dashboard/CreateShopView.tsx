import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sellerAuthApi, CreateShopRequest } from '@/lib/api/seller-auth';
import { handleApiError } from '@/lib/api/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CreateShopProps {
  sellerId: string;
  onSuccess: () => void;
}

type ShopFormData = Omit<CreateShopRequest, 'sellerId'>;

export function CreateShopView({ sellerId, onSuccess }: CreateShopProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShopFormData>();

  const createShopMutation = useMutation({
    mutationFn: (data: ShopFormData) =>
      sellerAuthApi.createShop({
        ...data,
        sellerId,
      }),
    onSuccess: (data) => {
      toast.success(data.message);
      onSuccess();
    },
    onError: (error) => {
      toast.error(handleApiError(error).message);
    },
  });

  const onSubmit = (data: ShopFormData) => {
    createShopMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[var(--white)] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[550px] w-full border border-[var(--cultured)] p-8 rounded-xl shadow-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-[var(--eerie-black)] flex items-center justify-center text-[var(--white)] font-bold text-xl">
              🏪
            </div>
          </div>
          <h2 className="text-2xl font-bold text-[var(--eerie-black)] tracking-tight mb-2">Create Your Shop</h2>
          <p className="text-[var(--sonic-silver)] text-sm">
            Setting up your business storefront takes less than a minute. Let&apos;s get started.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Shop Name"
            type="text"
            placeholder="Ceylon Crafts Premium"
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
              <option value="">Select a category...</option>
              <option value="electronics">Electronics & Gadgets</option>
              <option value="fashion">Fashion & Clothing</option>
              <option value="crafts">Ceylon Handicrafts & Arts</option>
              <option value="groceries">Ceylon Tea & Groceries</option>
              <option value="health">Health & Beauty</option>
              <option value="other">Other Accessories</option>
            </select>
            {errors.category && (
              <p className="text-xs text-[var(--bittersweet)] mt-1">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-[var(--davys-gray)]">
              Shop Biography
            </label>
            <textarea
              className="w-full min-h-[80px] p-3 border border-[var(--cultured)] rounded-md text-[var(--onyx)] focus:outline-none focus:border-[var(--salmon-pink)] focus:ring-1 focus:ring-[var(--salmon-pink)] text-sm"
              placeholder="Tell Ceylon customers about your store, products, and story..."
              {...register('bio', { required: 'Bio description is required' })}
            />
            {errors.bio && (
              <p className="text-xs text-[var(--bittersweet)] mt-1">{errors.bio.message}</p>
            )}
          </div>

          <Input
            label="Physical Address"
            type="text"
            placeholder="123 Galle Road, Colombo 03, Sri Lanka"
            error={errors.address?.message}
            {...register('address', { required: 'Shop address is required' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Opening Hours"
              type="text"
              placeholder="09:00 AM - 06:00 PM"
              error={errors.opening_hours?.message}
              {...register('opening_hours', { required: 'Opening hours are required' })}
            />
            <Input
              label="Website URL (Optional)"
              type="url"
              placeholder="https://ceyloncrafts.lk"
              error={errors.website?.message}
              {...register('website')}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-4"
            isLoading={createShopMutation.isPending}
          >
            {createShopMutation.isPending ? 'Setting up shop…' : 'Create Shop'}
          </Button>
        </form>
      </div>
    </div>
  );
}
