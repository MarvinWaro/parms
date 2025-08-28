// C:\Users\MARVIN\projects\parms\resources\js\components\property\ui\consolidated-qr-sticker.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink, Printer, QrCode } from 'lucide-react';
import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';

interface ConsolidatedQRStickerProps {
    propertyData: {
        item_name: string;
        property_number: string;
        qr_code_url: string;
        location?: string;
        user?: string;
    };
}

export default function ConsolidatedQRSticker({ propertyData }: ConsolidatedQRStickerProps) {
    // Screen preview (scaled)
    const previewRef = useRef<HTMLDivElement>(null);
    // Hidden, full-size print target
    const printRef = useRef<HTMLDivElement>(null);

    const handleOpenQR = () => {
        window.open(propertyData.qr_code_url, '_blank');
    };

    // react-to-print v3
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Official Property Sticker - ${propertyData.item_name}`,
        pageStyle: `
      @page { margin: 5mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .sticker { page-break-inside: avoid; }
      }
    `,
        onAfterPrint: () => toast.success('Sent to printer'),
    });

    const StickerPreview = ({ scale = 1 }: { scale?: number }) => (
        <div
            className="sticker"
            style={{
                width: `${4 * scale}in`,
                height: `${2.5 * scale}in`,
                background: 'linear-gradient(135deg, #e8f4f8 0%, #d1e7dd 100%)',
                border: `${3 * scale}px solid #0066cc`,
                borderRadius: `${8 * scale}px`,
                padding: `${12 * scale}px`,
                boxSizing: 'border-box',
                position: 'relative',
                fontFamily: 'Arial, sans-serif',
                boxShadow: scale === 1 ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
            }}
        >
            {/* Header */}
            <div
                style={{
                    textAlign: 'center',
                    borderBottom: `${2 * scale}px solid #0066cc`,
                    paddingBottom: `${8 * scale}px`,
                    marginBottom: `${10 * scale}px`,
                }}
            >
                <div
                    style={{
                        fontSize: `${10 * scale}px`,
                        fontWeight: 'bold',
                        color: '#0066cc',
                        lineHeight: '1.2',
                        marginBottom: `${2 * scale}px`,
                    }}
                >
                    Republic of the Philippines
                </div>
                <div
                    style={{
                        fontSize: `${8 * scale}px`,
                        fontWeight: 'bold',
                        color: '#333',
                        lineHeight: '1.2',
                        marginBottom: `${1 * scale}px`,
                    }}
                >
                    PROPERTY AND ASSETS REGISTRY MANAGEMENT SYSTEM
                </div>
                <div style={{ fontSize: `${7 * scale}px`, color: '#666', lineHeight: '1.2' }}>Regional Office No. 13, Caraga Region</div>
            </div>

            {/* Main */}
            <div style={{ display: 'flex', gap: `${12 * scale}px`, height: `calc(100% - ${50 * scale}px)` }}>
                {/* Left column */}
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div
                            style={{
                                fontSize: `${8 * scale}px`,
                                fontWeight: 'bold',
                                color: '#0066cc',
                                textTransform: 'uppercase',
                                marginBottom: `${2 * scale}px`,
                            }}
                        >
                            Article:
                        </div>
                        <div
                            style={{
                                fontSize: `${11 * scale}px`,
                                fontWeight: 'bold',
                                color: '#000',
                                textTransform: 'uppercase',
                                lineHeight: '1.1',
                                marginBottom: `${8 * scale}px`,
                            }}
                        >
                            {propertyData.item_name}
                        </div>
                    </div>

                    <div>
                        <div
                            style={{
                                fontSize: `${8 * scale}px`,
                                fontWeight: 'bold',
                                color: '#0066cc',
                                textTransform: 'uppercase',
                                marginBottom: `${2 * scale}px`,
                            }}
                        >
                            Property No.:
                        </div>
                        <div
                            style={{
                                fontSize: `${10 * scale}px`,
                                fontWeight: 'bold',
                                color: '#000',
                                lineHeight: '1.1',
                                marginBottom: `${8 * scale}px`,
                            }}
                        >
                            {propertyData.property_number}
                        </div>
                    </div>

                    <div style={{ fontSize: `${6 * scale}px`, color: '#666', fontStyle: 'italic', lineHeight: '1.2' }}>
                        Scan QR code for property details
                    </div>
                </div>

                {/* QR */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: `${85 * scale}px`,
                    }}
                >
                    <div
                        style={{
                            background: 'white',
                            padding: `${4 * scale}px`,
                            borderRadius: `${4 * scale}px`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        <QRCode
                            size={75 * scale}
                            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                            value={propertyData.qr_code_url}
                            viewBox="0 0 256 256"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div
                style={{
                    position: 'absolute',
                    bottom: `${4 * scale}px`,
                    left: `${12 * scale}px`,
                    right: `${12 * scale}px`,
                    borderTop: `${1 * scale}px solid #ccc`,
                    paddingTop: `${3 * scale}px`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div style={{ fontSize: `${6 * scale}px`, color: '#666', textAlign: 'center' }}>
                    <div style={{ marginBottom: `${1 * scale}px` }}>_______________</div>
                    <div>Property Custodian</div>
                </div>
                <div style={{ fontSize: `${5 * scale}px`, color: '#888', textAlign: 'center' }}>PARMS v1.0</div>
                <div style={{ fontSize: `${6 * scale}px`, color: '#666', textAlign: 'center' }}>
                    <div style={{ marginBottom: `${1 * scale}px` }}>_______________</div>
                    <div>Administrative Officer</div>
                </div>
            </div>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <QrCode className="h-5 w-5" />
                    QR Code
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Quick QR */}
                <div className="flex items-center gap-4 rounded-lg border bg-gray-50 p-4">
                    <div className="flex-shrink-0">
                        <QRCode
                            size={80}
                            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                            value={propertyData.qr_code_url}
                            viewBox="0 0 256 256"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="mb-2 text-xs text-muted-foreground">Scan to view property details</p>
                        <Button variant="outline" size="sm" onClick={handleOpenQR} className="h-8 w-full text-xs">
                            <ExternalLink className="mr-2 h-3 w-3" />
                            Open Link
                        </Button>
                    </div>
                </div>

                {/* Official Sticker Preview (scaled) */}
                <div>
                    <h4 className="mb-2 text-sm font-medium">Official Property Sticker</h4>
                    <div className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                        <div ref={previewRef} style={{ transform: 'scale(0.6)', transformOrigin: 'center' }}>
                            <StickerPreview scale={0.6} />
                        </div>
                    </div>
                </div>

                {/* Hidden full-size print target (kept off-screen) */}
                <div aria-hidden className="pointer-events-none fixed top-0 -left-[10000px]">
                    <div ref={printRef}>
                        <StickerPreview />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePrint} className="flex-1">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Sticker
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                                Full Preview
                            </Button>
                        </DialogTrigger>

                        {/* aria-describedby={undefined} silences the Radix warning if you really don't want a description */}
                        <DialogContent className="max-w-3xl" aria-describedby={undefined}>
                            <DialogHeader>
                                <DialogTitle>Official Property Sticker - Full Size</DialogTitle>
                                {/* Keep for a11y; visually hidden text is fine */}
                                <DialogDescription className="sr-only">
                                    Full-size preview of the property sticker to verify before printing.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex justify-center bg-gray-50 p-6">
                                <StickerPreview />
                            </div>

                            <div className="flex justify-center gap-2 pt-4">
                                <Button onClick={handlePrint}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Sticker
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                    Standard size: 4&quot; × 2.5&quot; — A4 sheet fits 8 stickers (2×4 layout)
                </div>
            </CardContent>
        </Card>
    );
}
