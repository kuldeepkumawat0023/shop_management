import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays } from 'date-fns';
import { cn } from '@/utils/cn';

export default function CalendarWidget() {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-6">
                <ChevronLeft className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-on-surface" onClick={prevMonth} />
                <span className="font-bold text-sm text-on-surface">{format(currentMonth, 'MMMM yyyy')}</span>
                <ChevronRight className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-on-surface" onClick={nextMonth} />
            </div>
        );
    };

    const renderDays = () => {
        const days = [];
        const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 }); // Sunday start
        for (let i = 0; i < 7; i++) {
            days.push(
                <div key={i} className="text-[10px] font-bold text-primary mb-4 text-center uppercase tracking-wider">
                    {format(addDays(startDate, i), 'EEE')}
                </div>
            );
        }
        return <div className="grid grid-cols-7 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = '';

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, 'd');
                const isSelectedDay = isSameDay(day, new Date());
                const isCurrentMonth = isSameMonth(day, monthStart);
                
                days.push(
                    <div
                        key={day.toString()}
                        className={cn(
                            "w-8 h-8 flex items-center justify-center text-xs font-medium rounded-full mx-auto cursor-pointer transition-all",
                            !isCurrentMonth ? "text-muted-foreground/30" : isSelectedDay ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "text-on-surface hover:bg-surface-container-high"
                        )}
                    >
                        <span>{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-y-3" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="space-y-3">{rows}</div>;
    };

    return (
        <div className="w-full h-full flex flex-col">
            {renderHeader()}
            <div className="flex-1 flex flex-col justify-center">
                {renderDays()}
                {renderCells()}
            </div>
        </div>
    );
}
