import { useState } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, closestCenter, useDraggable, useDroppable } from '@dnd-kit/core';
import { X, Sparkles, ArrowRight, AlertCircle, Zap } from 'lucide-react';
import { RARITY } from '@/constants';
import { formatMoney } from '@/utils';

const DraggableItem = ({ collectible, item, isDragging }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: collectible.id,
    });

    const rarityColors = {
        standard: 'border-blue-500/50 bg-blue-900/20',
        emerging: 'border-indigo-500/50 bg-indigo-900/20',
        disruptive: 'border-purple-500/50 bg-purple-900/20',
        unicorn: 'border-yellow-500/50 bg-yellow-900/20'
    };

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div 
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`relative p-3 rounded-lg border-2 transition-all cursor-move ${
                isDragging ? 'opacity-50 scale-95' : 'hover:scale-105 hover:shadow-lg'
            } ${rarityColors[collectible.rarity]}`}
        >
            <div className="flex flex-col items-center">
                <img 
                    src={`assets/items/${item.image}`} 
                    alt={item.name} 
                    className="w-16 h-16 object-contain mb-2"
                />
                <p className="text-xs font-bold text-white text-center line-clamp-2">{item.name}</p>
                <p className="text-[10px] text-slate-400 uppercase">{collectible.rarity}</p>
                <p className="text-[10px] text-emerald-400 font-mono font-bold">{formatMoney(collectible.purchasePrice)}</p>
            </div>
        </div>
    );
};

const DroppableSlot = ({ children, isActive, slotNumber, slotId }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: slotId,
    });

    return (
        <div 
            ref={setNodeRef}
            className={`relative w-24 h-32 rounded-lg border-2 border-dashed transition-all flex items-center justify-center ${
                isOver
                    ? 'border-emerald-500 bg-emerald-500/30 scale-105' 
                    : isActive 
                        ? 'border-emerald-500/50 bg-emerald-500/10 scale-105' 
                        : children 
                            ? 'border-slate-600 bg-slate-800/50' 
                            : 'border-slate-700 bg-slate-900/50'
            }`}
        >
            {children || (
                <div className="text-center">
                    <div className="text-slate-600 text-xs font-bold mb-1">Slot {slotNumber}</div>
                    <div className="text-slate-700 text-[10px]">Drop Here</div>
                </div>
            )}
        </div>
    );
};

const MergeModal = ({ isOpen, onClose, eligibleGroups, onMerge, items }) => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [craftingSlots, setCraftingSlots] = useState([]);
    const [activeId, setActiveId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    if (!isOpen) return null;

    const mergeRules = {
        standard: { required: 3, upgradeTo: 'emerging', label: 'Emerging' },
        emerging: { required: 3, upgradeTo: 'disruptive', label: 'Disruptive' },
        disruptive: { required: 5, upgradeTo: 'unicorn', label: 'Unicorn' }
    };

    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
        setCraftingSlots([]);
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        
        if (over && over.id.startsWith('slot-')) {
            const slotIndex = parseInt(over.id.split('-')[1]);
            const collectible = selectedGroup.collectibles.find(c => c.id === active.id);
            
            if (collectible && !craftingSlots.some(c => c.id === collectible.id)) {
                const newSlots = [...craftingSlots];
                newSlots[slotIndex] = collectible;
                setCraftingSlots(newSlots.filter(Boolean)); // Remove empty slots
            }
        }
        
        setActiveId(null);
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const handleRemoveFromSlot = (collectibleId) => {
        setCraftingSlots(craftingSlots.filter(c => c.id !== collectibleId));
    };

    const handleMerge = () => {
        if (!selectedGroup || craftingSlots.length !== selectedGroup.rule.required) return;
        
        const collectibleIds = craftingSlots.map(c => c.id);
        onMerge(collectibleIds);
        setSelectedGroup(null);
        setCraftingSlots([]);
    };

    const activeCollectible = activeId ? selectedGroup?.collectibles.find(c => c.id === activeId) : null;
    const activeItem = activeCollectible ? items.find(i => i.name === activeCollectible.itemName) : null;

    return (
        <div className="fixed inset-0 bg-slate-950/95 z-200 flex items-center justify-center p-4 backdrop-blur-sm fade-in" onClick={onClose}>
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-2 border-indigo-500 relative" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 z-10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-indigo-400 flex items-center gap-3">
                                <Sparkles className="w-8 h-8 animate-pulse" />
                                Merge Collectibles
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">Combine items to upgrade their rarity</p>
                        </div>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Merge Rules Info */}
                    <div className="glass-panel p-4 rounded-xl border border-yellow-500/30 bg-yellow-900/10 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm text-slate-200 font-bold mb-2">✨ Merge Rules</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-400">
                                    <div>📦 <span className="text-blue-400 font-bold">3 Standard</span> → <span className="text-indigo-400">1 Emerging</span></div>
                                    <div>⚡ <span className="text-indigo-400 font-bold">3 Emerging</span> → <span className="text-purple-400">1 Disruptive</span></div>
                                    <div>⭐ <span className="text-purple-400 font-bold">5 Disruptive</span> → <span className="text-yellow-400">1 Unicorn</span></div>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2">💡 Items must be the same type, rarity, and level. Merged items get +20% value bonus!</p>
                            </div>
                        </div>
                    </div>

                    {!selectedGroup ? (
                        <>
                            {/* Select Group */}
                            <h3 className="text-lg font-bold text-slate-300 mb-4">Select Items to Merge</h3>
                            
                            {eligibleGroups.length === 0 ? (
                                <div className="text-center py-12">
                                    <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-400">No eligible items for merging</p>
                                    <p className="text-slate-500 text-sm mt-2">You need multiple copies of the same item with the same rarity</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {eligibleGroups.map((group, idx) => {
                                        const item = items.find(i => i.name === group.itemName);
                                        if (!item) return null;

                                        const rarityInfo = Object.values(RARITY).find(r => r.id === group.rarity);
                                        const canMerge = group.count >= group.rule.required;

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => canMerge && handleGroupSelect(group)}
                                                disabled={!canMerge}
                                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                                    canMerge 
                                                        ? `${rarityInfo?.border} hover:scale-105 cursor-pointer hover:shadow-lg` 
                                                        : 'border-slate-700 opacity-50 cursor-not-allowed'
                                                }`}
                                            >
                                                <div className="flex gap-4">
                                                    <img src={`assets/items/${item.image}`} alt={item.name} className="w-20 h-20 object-contain" />
                                                    <div className="flex-1">
                                                        <p className="font-bold text-white mb-1">{item.name}</p>
                                                        <p className={`text-xs uppercase font-bold mb-2 ${rarityInfo?.color}`}>{group.rarity} • Level {group.level}</p>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span className="text-slate-400">Owned: <span className="font-bold text-white">{group.count}</span></span>
                                                            <span className="text-slate-600">•</span>
                                                            <span className="text-slate-400">Need: <span className="font-bold text-emerald-400">{group.rule.required}</span></span>
                                                        </div>
                                                        {canMerge && (
                                                            <div className="mt-2 flex items-center gap-2 text-xs">
                                                                <ArrowRight className="w-4 h-4 text-emerald-400" />
                                                                <span className="text-emerald-400 font-bold">Can merge to {group.rule.label}!</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDragCancel={handleDragCancel}
                        >
                            {/* Crafting Area */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedGroup(null);
                                            setCraftingSlots([]);
                                        }}
                                        className="text-slate-400 hover:text-white transition-colors text-sm"
                                    >
                                        ← Back to Selection
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Available Items */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-300 mb-3">Available Items ({selectedGroup.collectibles.filter(c => !craftingSlots.some(slot => slot.id === c.id)).length})</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {selectedGroup.collectibles
                                                .filter(c => !craftingSlots.some(slot => slot.id === c.id))
                                                .map(collectible => {
                                                    const item = items.find(i => i.name === collectible.itemName);
                                                    return (
                                                        <DraggableItem 
                                                            key={collectible.id}
                                                            collectible={collectible} 
                                                            item={item} 
                                                            isDragging={activeId === collectible.id}
                                                        />
                                                    );
                                                })}
                                        </div>
                                    </div>

                                    {/* Crafting Slots */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-300 mb-3">
                                            Merge Slots ({craftingSlots.length}/{selectedGroup.rule.required})
                                        </h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {Array.from({ length: selectedGroup.rule.required }).map((_, idx) => (
                                                <div key={idx}>
                                                    <DroppableSlot slotNumber={idx + 1} slotId={`slot-${idx}`} isActive={activeId !== null}>
                                                        {craftingSlots[idx] && (
                                                            <div className="relative w-full h-full pointer-events-none">
                                                                <div className="flex flex-col items-center p-2">
                                                                    <img 
                                                                        src={`assets/items/${items.find(i => i.name === craftingSlots[idx].itemName)?.image}`} 
                                                                        alt={craftingSlots[idx].itemName}
                                                                        className="w-12 h-12 object-contain mb-1"
                                                                    />
                                                                    <p className="text-[10px] font-bold text-white text-center line-clamp-1">{craftingSlots[idx].itemName}</p>
                                                                    <p className="text-[8px] text-emerald-400 font-mono">{formatMoney(craftingSlots[idx].purchasePrice)}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleRemoveFromSlot(craftingSlots[idx].id)}
                                                                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors pointer-events-auto z-10"
                                                                >
                                                                    <X className="w-3 h-3 text-white" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </DroppableSlot>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Result Preview Card */}
                                        {craftingSlots.length === selectedGroup.rule.required && (() => {
                                            const resultItem = items.find(i => i.name === selectedGroup.itemName);
                                            const upgradedRarityInfo = Object.values(RARITY).find(r => r.id === selectedGroup.rule.upgradeTo);
                                            const totalPrice = craftingSlots.reduce((sum, c) => sum + c.purchasePrice, 0);
                                            const newValue = Math.floor(totalPrice * 1.2);
                                            
                                            return (
                                                <div className="mt-6">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <ArrowRight className="w-5 h-5 text-emerald-400" />
                                                        <p className="text-sm font-bold text-emerald-400 uppercase">Merge Result Preview</p>
                                                    </div>
                                                    
                                                    <div className={`relative p-4 rounded-xl border-2 ${upgradedRarityInfo?.border} bg-slate-900 hover:scale-105 transition-all shadow-lg`}>
                                                        {/* Rarity Badge */}
                                                        <div className="absolute top-2 left-2 z-10">
                                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${upgradedRarityInfo?.bg} ${upgradedRarityInfo?.color} border ${upgradedRarityInfo?.border} shadow-md`}>
                                                                {selectedGroup.rule.label}
                                                            </span>
                                                        </div>
                                                        
                                                        {/* Level Badge */}
                                                        <div className="absolute top-2 right-2 z-10">
                                                            <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-800 text-white border border-slate-600">
                                                                Lv.{selectedGroup.level + 1}
                                                            </span>
                                                        </div>

                                                        {/* Item Image */}
                                                        <div className="flex justify-center mb-3 mt-6">
                                                            <img 
                                                                src={`assets/items/${resultItem?.image}`} 
                                                                alt={selectedGroup.itemName}
                                                                className="w-24 h-24 object-contain animate-pulse"
                                                            />
                                                        </div>

                                                        {/* Item Info */}
                                                        <div className="text-center mb-3">
                                                            <h3 className="font-bold text-white text-lg mb-1">{selectedGroup.itemName}</h3>
                                                            <p className="text-xs text-slate-400 italic">"{resultItem?.flavorText}"</p>
                                                        </div>

                                                        {/* Stats */}
                                                        <div className="space-y-2">
                                                            <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs text-slate-400">New Value (+20%)</span>
                                                                    <span className="font-mono font-bold text-emerald-400 text-sm">{formatMoney(newValue)}</span>
                                                                </div>
                                                            </div>
                                                            <div className="bg-slate-800/50 rounded-lg p-2 border border-slate-700">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs text-slate-400">Sell Value (65%)</span>
                                                                    <span className="font-mono font-bold text-orange-400 text-sm">{formatMoney(Math.floor(newValue * 0.65))}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Merge Button */}
                                <button
                                    onClick={handleMerge}
                                    disabled={craftingSlots.length !== selectedGroup.rule.required}
                                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-3 ${
                                        craftingSlots.length === selectedGroup.rule.required
                                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-105'
                                            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                    }`}
                                >
                                    <Sparkles className="w-6 h-6" />
                                    Merge Items
                                </button>
                            </div>

                            <DragOverlay>
                                {activeId && activeCollectible && activeItem ? (
                                    <div className="opacity-80 rotate-6 scale-110">
                                        <DraggableItem collectible={activeCollectible} item={activeItem} isDragging={false} />
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MergeModal;
