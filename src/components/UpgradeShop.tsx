import { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { getVehicleStats, getPartById, calculatePartEffects } from '../game/VehicleSystem';
import { VEHICLE_PARTS, PART_CATEGORY_NAMES, PART_CATEGORY_ICONS, REPAIR_COST } from '../game/constants';
import type { PartCategory, VehiclePart, EquippedParts } from '../game/types';
import { X, ShoppingCart, Zap, Heart, Wrench, Gauge, Battery, Cog, ArrowRight, Check } from 'lucide-react';
import { formatMoney } from '../game/EconomySystem';

function StatRow({
  label,
  currentValue,
  newValue,
  format,
  isBetter = (a, b) => a > b,
  icon,
}: {
  label: string;
  currentValue: number;
  newValue?: number;
  format?: (v: number) => string;
  isBetter?: (current: number, next: number) => boolean;
  icon?: React.ReactNode;
}) {
  const displayFormat = format || ((v) => v.toFixed(1));
  const hasChange = newValue !== undefined && newValue !== currentValue;
  const isPositive = hasChange && newValue !== undefined && isBetter(newValue, currentValue);
  const isNegative = hasChange && newValue !== undefined && !isBetter(newValue, currentValue);

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-game-neon/10 last:border-0">
      <div className="flex items-center gap-2 font-retro text-sm text-gray-300">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-retro text-sm ${hasChange ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
          {displayFormat(currentValue)}
        </span>
        {hasChange && newValue !== undefined && (
          <>
            <ArrowRight size={14} className="text-gray-500" />
            <span
              className={`font-retro text-sm font-bold ${
                isPositive ? 'text-game-success' : isNegative ? 'text-game-danger' : 'text-gray-200'
              }`}
            >
              {displayFormat(newValue)}
              {isPositive && ' ▲'}
              {isNegative && ' ▼'}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default function UpgradeShop() {
  const dispatch = useGameStore((state) => state.dispatch);
  const showUpgradeShop = useGameStore((state) => state.showUpgradeShop);
  const vehicle = useGameStore((state) => state.vehicle);
  const player = useGameStore((state) => state.player);

  const [selectedCategory, setSelectedCategory] = useState<PartCategory>('tire');
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  const currentStats = useMemo(() => getVehicleStats(vehicle), [vehicle]);
  const currentEquippedPartId = vehicle.equippedParts[selectedCategory];
  const currentEquippedPart = currentEquippedPartId ? getPartById(currentEquippedPartId) : null;
  const selectedPart = selectedPartId ? getPartById(selectedPartId) : null;

  const categoryParts = useMemo(
    () => VEHICLE_PARTS.filter((p) => p.category === selectedCategory),
    [selectedCategory]
  );

  const previewStats = useMemo(() => {
    if (!selectedPart) return null;
    const previewEquipped: EquippedParts = {
      ...vehicle.equippedParts,
      [selectedCategory]: selectedPart.id,
    };
    const effects = calculatePartEffects(previewEquipped);
    return {
      effectiveSpeed: vehicle.baseSpeed + effects.totalSpeedBonus,
      effectiveMaxBattery: vehicle.maxBattery + effects.totalMaxBatteryBonus,
      effectiveMaxDurability: vehicle.maxDurability + effects.totalMaxDurabilityBonus,
      effectiveBatteryDrainRate: (1.0) * effects.totalBatteryDrainModifier,
      effectiveDurabilityDrainRate: (0.25) * effects.totalDurabilityDrainModifier,
      effects,
    };
  }, [selectedPart, selectedCategory, vehicle]);

  const monthlyRepairCost = (maxDura: number, drainRate: number) => {
    const repairsPerHour = (drainRate * 3600) / maxDura;
    return repairsPerHour * maxDura * REPAIR_COST;
  };

  const handleBuy = () => {
    if (!selectedPart || !selectedPartId) return;
    dispatch({ type: 'BUY_PART', partId: selectedPartId, category: selectedCategory });
    setSelectedPartId(null);
  };

  if (!showUpgradeShop) return null;

  const categories: PartCategory[] = ['tire', 'motor', 'battery', 'frame'];

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
      <div className="game-card w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-game-neon/30">
          <div className="flex items-center gap-3">
            <ShoppingCart size={24} className="text-game-neon" />
            <h2 className="font-pixel text-xl text-game-neon glow-text">车辆改装店</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-retro text-sm text-gray-400">余额:</span>
              <span className="font-retro text-xl text-game-streetLight">{formatMoney(player.money)}</span>
            </div>
            <button
              onClick={() => {
                dispatch({ type: 'CLOSE_UPGRADE_SHOP' });
                setSelectedPartId(null);
              }}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-44 border-r border-game-neon/20 flex flex-col p-2 gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedPartId(null);
                }}
                className={`p-3 rounded text-left transition-all ${
                  selectedCategory === cat
                    ? 'bg-game-neon/20 border border-game-neon/50 text-game-neon'
                    : 'hover:bg-game-neon/10 text-gray-300 border border-transparent'
                }`}
              >
                <div className="font-pixel text-sm flex items-center gap-2">
                  <span>{PART_CATEGORY_ICONS[cat]}</span>
                  {PART_CATEGORY_NAMES[cat]}
                </div>
                {currentEquippedPartId && (
                  <div className="font-retro text-xs mt-1 text-gray-400 truncate">
                    当前: {getPartById(vehicle.equippedParts[cat]!)?.name || '无'}
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-pixel text-sm text-game-streetLight mb-2">
                  {PART_CATEGORY_ICONS[selectedCategory]} {PART_CATEGORY_NAMES[selectedCategory]}选择
                </h3>
                <div className="space-y-2">
                  {categoryParts.map((part) => {
                    const isEquipped = part.id === currentEquippedPartId;
                    const isSelected = part.id === selectedPartId;
                    const canAfford = player.money >= part.price;
                    const isBuyable = !isEquipped && canAfford;

                    return (
                      <button
                        key={part.id}
                        onClick={() => !isEquipped && setSelectedPartId(part.id)}
                        disabled={isEquipped}
                        className={`w-full text-left p-3 rounded border-2 transition-all ${
                          isEquipped
                            ? 'border-game-success/50 bg-game-success/10 cursor-default'
                            : isSelected
                            ? 'border-game-neon bg-game-neon/20'
                            : canAfford
                            ? 'border-gray-600 hover:border-game-neon/50 hover:bg-game-neon/5'
                            : 'border-gray-700 bg-gray-800/50 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-pixel text-sm text-gray-100">{part.name}</span>
                              <span className="font-retro text-xs px-1.5 py-0.5 rounded bg-game-neon/20 text-game-neon">
                                T{part.tier}
                              </span>
                              {isEquipped && (
                                <span className="flex items-center gap-1 text-game-success font-retro text-xs">
                                  <Check size={12} /> 已装备
                                </span>
                              )}
                            </div>
                            <p className="font-retro text-xs text-gray-400 mt-1.5">{part.description}</p>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            {!isEquipped && (
                              <div
                                className={`font-pixel text-sm ${
                                  canAfford ? 'text-game-streetLight' : 'text-game-danger'
                                }`}
                              >
                                ¥{part.price}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-retro">
                          <span className="text-gray-500">
                            重量: <span className="text-gray-300">{part.weight}kg</span>
                          </span>
                          <span className="text-gray-500">
                            速度:{' '}
                            <span className={part.speedBonus > 0 ? 'text-game-success' : part.speedBonus < 0 ? 'text-game-danger' : 'text-gray-300'}>
                              {part.speedBonus > 0 ? '+' : ''}{part.speedBonus}
                            </span>
                          </span>
                          <span className="text-gray-500">
                            耗电率:{' '}
                            <span className={part.batteryDrainModifier < 1 ? 'text-game-success' : part.batteryDrainModifier > 1 ? 'text-game-danger' : 'text-gray-300'}>
                              {((part.batteryDrainModifier - 1) * 100).toFixed(0)}%
                            </span>
                          </span>
                          <span className="text-gray-500">
                            耐久率:{' '}
                            <span className={part.durabilityDrainModifier < 1 ? 'text-game-success' : part.durabilityDrainModifier > 1 ? 'text-game-danger' : 'text-gray-300'}>
                              {((part.durabilityDrainModifier - 1) * 100).toFixed(0)}%
                            </span>
                          </span>
                          {part.maxBatteryBonus > 0 && (
                            <span className="text-gray-500">
                              电池容量: <span className="text-game-success">+{part.maxBatteryBonus}</span>
                            </span>
                          )}
                          {part.maxDurabilityBonus > 0 && (
                            <span className="text-gray-500">
                              最大耐久: <span className="text-game-success">+{part.maxDurabilityBonus}</span>
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-pixel text-sm text-game-streetLight mb-2">📊 属性对比</h3>

                <div className="game-card !bg-game-nightLight p-4 space-y-0.5">
                  <div className="font-pixel text-xs text-game-neon mb-2 pb-2 border-b border-game-neon/20">
                    {selectedPart
                      ? `对比: ${currentEquippedPart?.name || '无'} → ${selectedPart.name}`
                      : `当前配置 (${currentEquippedPart?.name || '无'})`}
                  </div>

                  <StatRow
                    label="移动速度"
                    icon={<Gauge size={14} className="text-game-neon" />}
                    currentValue={currentStats.effectiveSpeed}
                    newValue={previewStats?.effectiveSpeed}
                    format={(v) => `${v.toFixed(0)}`}
                  />
                  <StatRow
                    label="最大电量"
                    icon={<Battery size={14} className="text-game-neon" />}
                    currentValue={currentStats.effectiveMaxBattery}
                    newValue={previewStats?.effectiveMaxBattery}
                    format={(v) => `${v.toFixed(0)}`}
                  />
                  <StatRow
                    label="最大耐久"
                    icon={<Wrench size={14} className="text-game-streetLight" />}
                    currentValue={currentStats.effectiveMaxDurability}
                    newValue={previewStats?.effectiveMaxDurability}
                    format={(v) => `${v.toFixed(0)}`}
                  />
                  <StatRow
                    label="耗电速率"
                    icon={<Zap size={14} className="text-game-neon" />}
                    currentValue={currentStats.effectiveBatteryDrainRate}
                    newValue={previewStats?.effectiveBatteryDrainRate}
                    isBetter={(a, b) => a < b}
                    format={(v) => `${v.toFixed(2)}/s`}
                  />
                  <StatRow
                    label="耐久损耗"
                    icon={<Cog size={14} className="text-game-streetLight" />}
                    currentValue={currentStats.effectiveDurabilityDrainRate}
                    newValue={previewStats?.effectiveDurabilityDrainRate}
                    isBetter={(a, b) => a < b}
                    format={(v) => `${v.toFixed(3)}/s`}
                  />
                  <StatRow
                    label="总重量"
                    icon={<Heart size={14} className="text-game-danger" />}
                    currentValue={currentStats.effects.totalWeight}
                    newValue={previewStats?.effects.totalWeight}
                    isBetter={(a, b) => a < b}
                    format={(v) => `${v.toFixed(0)}kg`}
                  />
                </div>

                <div className="game-card !bg-game-nightLight p-4">
                  <div className="font-pixel text-xs text-game-streetLight mb-2 pb-2 border-b border-game-neon/20">
                    💰 经济预估 (每小时)
                  </div>
                  <div className="space-y-0.5">
                    <StatRow
                      label="充电成本"
                      currentValue={currentStats.effectiveBatteryDrainRate * 3600 * 0.5}
                      newValue={previewStats ? previewStats.effectiveBatteryDrainRate * 3600 * 0.5 : undefined}
                      isBetter={(a, b) => a < b}
                      format={(v) => `¥${v.toFixed(0)}`}
                    />
                    <StatRow
                      label="维修成本"
                      currentValue={monthlyRepairCost(
                        currentStats.effectiveMaxDurability,
                        currentStats.effectiveDurabilityDrainRate
                      )}
                      newValue={
                        previewStats
                          ? monthlyRepairCost(
                              previewStats.effectiveMaxDurability,
                              previewStats.effectiveDurabilityDrainRate
                            )
                          : undefined
                      }
                      isBetter={(a, b) => a < b}
                      format={(v) => `¥${v.toFixed(0)}`}
                    />
                  </div>
                </div>

                {selectedPart && (
                  <button
                    onClick={handleBuy}
                    disabled={player.money < selectedPart.price || selectedPart.id === currentEquippedPartId}
                    className={`pixel-btn w-full py-3 flex items-center justify-center gap-2 ${
                      player.money >= selectedPart.price && selectedPart.id !== currentEquippedPartId
                        ? 'pixel-btn-success'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={16} />
                    <span className="font-pixel text-sm">
                      购买并装备 · ¥{selectedPart.price}
                    </span>
                  </button>
                )}

                {!selectedPart && (
                  <div className="text-center py-6 text-gray-500 font-retro text-sm">
                    👈 请选择一个配件查看对比
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-game-neon/20 p-3 bg-game-nightLight/50">
              <div className="font-retro text-xs text-gray-400 flex flex-wrap gap-4">
                <span>📌 提示:</span>
                <span>每个类别只能装备一个配件</span>
                <span>•</span>
                <span>超过70kg有重量惩罚</span>
                <span>•</span>
                <span>原厂配件不可售卖</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
