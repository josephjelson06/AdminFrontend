'use client';

/**
 * IncidentCard Component
 * 
 * Displays incident details with image, priority, and actions.
 * Uses the BaseCard and Status systems for consistent styling.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    BaseCard,
    CardMedia,
    CardHeader,
    CardTitle,
    CardDescription,
    CardActions,
    PriorityBadge,
    StatusBadge,
    TimeMeta,
    getSemanticToken,
    getTokenStyles,
} from '@/components/hotel/shared';
import {
    type Incident,
    type IncidentPriority,
} from '@/lib/hotel/hotel-data';
import { PRIORITY_OPTIONS } from '@/lib/services/hotelIncidentsService';

interface IncidentCardProps {
    incident: Incident;
    onSetPriority?: (id: string, priority: IncidentPriority) => void;
    onAssign?: (id: string) => void;
    onResolve?: (id: string) => void;
    showActions?: boolean;
}

export function IncidentCard({
    incident,
    onSetPriority,
    onAssign,
    onResolve,
    showActions = false,
}: IncidentCardProps) {
    const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
    const needsPriority = incident.priority === null;
    const isResolved = incident.status === 'Resolved';

    // Get styles from semantic token
    const priorityToken = getSemanticToken(incident.priority);
    const priorityStyles = getTokenStyles(priorityToken);

    // Animation variants for staggering content
    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            variants={contentVariants}
            whileHover={{
                scale: 1.03,
                boxShadow: '0px 10px 30px -5px rgba(0, 0, 0, 0.15)',
                transition: { type: 'spring', stiffness: 300, damping: 20 }
            }}
            className={cn(
                'w-full rounded-2xl border bg-card text-card-foreground shadow-lg cursor-pointer relative',
                isResolved && 'opacity-60',
                showPriorityDropdown && 'z-[110]'
            )}
        >
            {/* Image Section */}
            <CardMedia
                src={incident.guestReportPhoto}
                alt="Incident"
                height="h-40"
            >
                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-background/70 backdrop-blur-sm">
                        Room #{incident.roomNumber}
                    </Badge>
                </div>
                <div className="absolute top-3 right-3">
                    <PriorityBadge
                        priority={incident.priority}
                        className={cn("backdrop-blur-sm", priorityStyles.badgeSolid)}
                    />
                </div>
            </CardMedia>

            {/* Content Section */}
            <motion.div variants={contentVariants} className="p-5 space-y-4">
                <CardHeader>
                    <motion.div variants={itemVariants}>
                        <CardTitle size="lg">{incident.guestName}</CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <StatusBadge status={incident.status} />
                    </motion.div>
                </CardHeader>

                <motion.div variants={itemVariants}>
                    <TimeMeta time={incident.reportedAt} variant="relative" />
                </motion.div>

                <motion.div variants={itemVariants}>
                    <CardDescription className="leading-relaxed line-clamp-2">
                        {incident.description}
                    </CardDescription>
                </motion.div>

                {/* Actions */}
                {showActions && (
                    <motion.div variants={itemVariants}>
                        <CardActions className="pt-2">
                            {needsPriority && onSetPriority ? (
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowPriorityDropdown(!showPriorityDropdown);
                                        }}
                                        className="w-full justify-between"
                                    >
                                        Set Priority
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </Button>
                                    {showPriorityDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1 z-[100]">
                                            {PRIORITY_OPTIONS.map(opt => (
                                                <button
                                                    key={opt.value}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onSetPriority(incident.id, opt.value);
                                                        setShowPriorityDropdown(false);
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                                >
                                                    <PriorityBadge priority={opt.value} showIcon={false} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : null}

                            {onAssign && (
                                <Button
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAssign(incident.id);
                                    }}
                                    disabled={needsPriority}
                                    className="w-full group"
                                >
                                    <Send className="w-3.5 h-3.5 mr-1.5" />
                                    Assign to Staff
                                </Button>
                            )}

                            {onResolve && !isResolved && (
                                <Button
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onResolve(incident.id);
                                    }}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                    Mark Resolved
                                </Button>
                            )}
                        </CardActions>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}
