'use client';

import React, { useState, useEffect } from 'react';

import { IProductVariant } from '@/interface/request/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icon } from '@mdi/react';
import { mdiAutoFix } from '@mdi/js';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

interface VariantGeneratorProps {
  baseVariant: IProductVariant;
  onGenerate: (variants: IProductVariant[]) => void;
  onClose: () => void;
}

interface GeneratedVariant extends IProductVariant {
  id: string;
  selected: boolean;
}

const VariantGenerator: React.FC<VariantGeneratorProps> = ({
  baseVariant,
  onGenerate,
  onClose
}) => {
  const [generatedVariants, setGeneratedVariants] = useState<GeneratedVariant[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setGeneratedVariants(prev =>
      prev.map(variant => ({ ...variant, selected: checked }))
    );
  };

  const handleVariantSelect = (id: string, checked: boolean) => {
    setGeneratedVariants(prev =>
      prev.map(variant =>
        variant.id === id ? { ...variant, selected: checked } : variant
      )
    );
  };

  const handleStockChange = (id: string, stock: number) => {
    setGeneratedVariants(prev =>
      prev.map(variant =>
        variant.id === id ? { ...variant, stock } : variant
      )
    );
  };

  const handleGenerate = () => {
    const selectedVariants = generatedVariants
      .filter(variant => variant.selected)
      .map(variant => ({
        colorId: variant.colorId,
        sizeId: variant.sizeId,
        price: variant.price,
        stock: variant.stock,
        images: variant.images
      }));

    onGenerate(selectedVariants);
  };

  const selectedCount = generatedVariants.filter(v => v.selected).length;
  const totalCount = generatedVariants.length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="flex items-center justify-between w-full">
              <div className='flex items-center gap-2'>
                <Icon path={mdiAutoFix} size={0.7} className="text-primary" />
                Generate tất cả biến thể
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    id="select-all"
                    checked={selectedCount === totalCount}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="font-medium">
                    Chọn tất cả ({selectedCount}/{totalCount})
                  </Label>
                </div>
                <div className="text-sm text-maintext">
                  Chọn các biến thể bạn muốn tạo
                </div>
              </div>

              <div className="grid gap-4">
                <AnimatePresence>
                  {generatedVariants.map((variant, index) => {
                    return (
                      <motion.div
                        key={variant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.02 }}
                        className={`
                          border rounded-lg p-4 transition-all
                          ${variant.selected ? 'border-primary bg-primary/5' : 'border-gray-200 bg-gray-50'}
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={variant.selected}
                            onCheckedChange={(checked) =>
                              handleVariantSelect(variant.id, checked as boolean)
                            }
                          />

                          <div className="flex items-center gap-4 flex-1">
                            <div className="font-semibold text-primary">
                              {formatPrice(variant.price)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Label htmlFor={`stock-${variant.id}`} className="text-sm">
                              Số lượng:
                            </Label>
                            <Input
                              id={`stock-${variant.id}`}
                              type="number"
                              min="0"
                              value={variant.stock || ''}
                              onChange={(e) =>
                                handleStockChange(variant.id, parseInt(e.target.value) || 0)
                              }
                              className="w-20"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>

          <div className="border-t p-4 flex justify-between items-center">
            <div className="text-sm text-maintext">
              Đã chọn {selectedCount} biến thể
            </div>
            <div className="flex gap-4">
              <DialogClose asChild>
                <Button variant="outline">
                  Hủy
                </Button>
              </DialogClose>
              <Button
                onClick={handleGenerate}
                disabled={selectedCount === 0}
                className="flex items-center gap-2"
              >
                <Icon path={mdiAutoFix} size={0.7} />
                Tạo {selectedCount} biến thể
              </Button>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default VariantGenerator; 