'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, Command, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function VoiceAssistant() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const router = useRouter();

    const handleCommand = useCallback((cmd: string) => {
        const command = cmd.toLowerCase().trim();
        console.log('Voice Command:', command);

        if (command.includes('caisse') || command.includes('pos') || command.includes('vente')) {
            toast.success('Ouverture du Point de Vente...');
            router.push('/pos');
        } else if (command.includes('produit')) {
            toast.success('Navigation vers les produits...');
            router.push('/products');
        } else if (command.includes('rapport') || command.includes('statistique')) {
            router.push('/dashboard/reports');
        } else if (command.includes('stock') || command.includes('inventaire')) {
            router.push('/dashboard/stock');
        } else if (command.includes('accueil') || command.includes('dashboard')) {
            router.push('/dashboard');
        } else if (command.includes('client')) {
            router.push('/dashboard/customers');
        } else if (command.includes('fournisseur')) {
            router.push('/dashboard/suppliers');
        } else if (command.includes('achat')) {
            router.push('/dashboard/purchases');
        } else {
            toast.info(`Commande non reconnue : "${command}"`);
        }
    }, [router]);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'fr-FR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const result = event.results[current][0].transcript;
            setTranscript(result);
            handleCommand(result);
        };

        if (isListening) {
            recognition.start();
        }

        return () => recognition.stop();
    }, [isListening, handleCommand]);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {transcript && (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Volume2 className="h-4 w-4 text-blue-500" />
                        <span className="italic">"{transcript}"</span>
                    </div>
                </div>
            )}
            <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                className={`h-14 w-14 rounded-full shadow-2xl transition-all hover:scale-110 ${isListening ? 'animate-pulse' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                    }`}
                onClick={() => setIsListening(!isListening)}
            >
                {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border shadow-sm flex items-center gap-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                <Command className="h-3 w-3" /> Assistant Vocal
            </div>
        </div>
    );
}
