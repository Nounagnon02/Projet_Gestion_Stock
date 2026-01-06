'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Zap, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductScannerProps {
    onDetected: (productId: number) => void;
    onClose: () => void;
}

export default function ProductScanner({ onDetected, onClose }: ProductScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        let stream: MediaStream | null = null;

        async function setupCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsLoading(false);
                }
            } catch (err) {
                console.error("Camera access denied", err);
                toast.error("Accès à la caméra refusé ou non disponible");
                onClose();
            }
        }

        setupCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onClose]);

    const handleScan = () => {
        if (!videoRef.current || !canvasRef.current) return;

        setIsScanning(true);

        // Simuler une détection de produit après un léger délai d'analyse
        setTimeout(() => {
            setIsScanning(false);
            // Pour la démo, on simule avoir trouvé un produit aléatoire
            // Dans une vraie app, on utiliserait une lib comme QuaggaJS ou ZXing
            // ou un appel API vers un modèle de reconnaissance d'image
            const randomProductId = Math.floor(Math.random() * 5) + 1;
            toast.success("Produit identifié !");
            onDetected(randomProductId);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="relative w-full max-w-lg aspect-[3/4] overflow-hidden rounded-2xl border-2 border-blue-500/50 shadow-2xl bg-black">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4">
                        <RefreshCw className="h-10 w-10 animate-spin text-blue-500" />
                        <p className="text-sm font-medium">Initialisation de la caméra...</p>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />

                        {/* Scan Area Overlay */}
                        <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40">
                            <div className="w-full h-full relative border-2 border-white/30">
                                {/* Corners */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>

                                {/* Scanning Laser Line */}
                                <div className="absolute left-0 right-0 h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 px-10">
                            <Button
                                size="lg"
                                className={`h-16 w-16 rounded-full shadow-xl transition-all ${isScanning ? 'bg-orange-500' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                onClick={handleScan}
                                disabled={isScanning}
                            >
                                {isScanning ? (
                                    <Zap className="h-8 w-8 animate-pulse" />
                                ) : (
                                    <Scan className="h-8 w-8" />
                                )}
                            </Button>
                        </div>

                        <div className="absolute bottom-2 left-0 right-0 text-center">
                            <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                                {isScanning ? 'Analyse en cours...' : 'Cadrez le produit'}
                            </p>
                        </div>
                    </>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-white/10"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </Button>

                <canvas ref={canvasRef} className="hidden" />
            </div>

            <style jsx global>{`
                @keyframes scan {
                    0%, 100% { top: 0%; }
                    50% { top: 100%; }
                }
            `}</style>
        </div>
    );
}
