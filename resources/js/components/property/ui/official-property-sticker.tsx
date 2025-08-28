import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Printer, QrCode } from 'lucide-react';
import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

interface OfficialPropertyStickerProps {
    propertyData: {
        item_name: string;
        property_number: string;
        qr_code_url: string;
        location?: string;
        user?: string;
    };
}

export default function OfficialPropertySticker({ propertyData }: OfficialPropertyStickerProps) {
    const stickerRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        if (!stickerRef.current) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const stickerContent = stickerRef.current.innerHTML;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Official Property Sticker - ${propertyData.item_name}</title>
                    <style>
                        @media print {
                            body { margin: 0; padding: 5mm; }
                            .sticker { page-break-inside: avoid; }
                        }
                        body {
                            margin: 0;
                            padding: 20px;
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            min-height: 100vh;
                            background: #f5f5f5;
                        }
                    </style>
                </head>
                <body>
                    ${stickerContent}
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const handleDownload = () => {
        if (!stickerRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size for high resolution
        canvas.width = 576; // 4 inches at 144 DPI
        canvas.height = 360; // 2.5 inches at 144 DPI

        // Create image from the sticker HTML
        const data = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="576" height="360">
                <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif;">
                        ${stickerRef.current.outerHTML}
                    </div>
                </foreignObject>
            </svg>
        `)}`;

        const img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0, 576, 360);

            const link = document.createElement('a');
            link.download = `property-sticker-${propertyData.property_number.replace(/\//g, '-')}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            toast.success('Sticker downloaded successfully!');
        };
        img.src = data;
    };

    const StickerContent = ({ scale = 1 }: { scale?: number }) => (
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
                boxShadow: scale === 1 ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
            }}
        >
            {/* Header with Government Info */}
            <div style={{
                textAlign: 'center',
                borderBottom: `${2 * scale}px solid #0066cc`,
                paddingBottom: `${8 * scale}px`,
                marginBottom: `${10 * scale}px`
            }}>
                <div style={{
                    fontSize: `${10 * scale}px`,
                    fontWeight: 'bold',
                    color: '#0066cc',
                    lineHeight: '1.2',
                    marginBottom: `${2 * scale}px`
                }}>
                    Republic of the Philippines
                </div>
                <div style={{
                    fontSize: `${8 * scale}px`,
                    fontWeight: 'bold',
                    color: '#333',
                    lineHeight: '1.2',
                    marginBottom: `${1 * scale}px`
                }}>
                    PROPERTY AND ASSETS REGISTRY MANAGEMENT SYSTEM
                </div>
                <div style={{
                    fontSize: `${7 * scale}px`,
                    color: '#666',
                    lineHeight: '1.2'
                }}>
                    Regional Office No. 13, Caraga Region
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{
                display: 'flex',
                gap: `${12 * scale}px`,
                height: `calc(100% - ${50 * scale}px)`
            }}>
                {/* Property Information */}
                <div style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    {/* Article */}
                    <div>
                        <div style={{
                            fontSize: `${8 * scale}px`,
                            fontWeight: 'bold',
                            color: '#0066cc',
                            textTransform: 'uppercase',
                            marginBottom: `${2 * scale}px`
                        }}>
                            Article:
                        </div>
                        <div style={{
                            fontSize: `${11 * scale}px`,
                            fontWeight: 'bold',
                            color: '#000',
                            textTransform: 'uppercase',
                            lineHeight: '1.1',
                            marginBottom: `${8 * scale}px`
                        }}>
                            {propertyData.item_name}
                        </div>
                    </div>

                    {/* Property Number */}
                    <div>
                        <div style={{
                            fontSize: `${8 * scale}px`,
                            fontWeight: 'bold',
                            color: '#0066cc',
                            textTransform: 'uppercase',
                            marginBottom: `${2 * scale}px`
                        }}>
                            Property No.:
                        </div>
                        <div style={{
                            fontSize: `${10 * scale}px`,
                            fontWeight: 'bold',
                            color: '#000',
                            lineHeight: '1.1',
                            marginBottom: `${8 * scale}px`
                        }}>
                            {propertyData.property_number}
                        </div>
                    </div>

                    {/* QR Code Instructions */}
                    <div style={{
                        fontSize: `${6 * scale}px`,
                        color: '#666',
                        fontStyle: 'italic',
                        lineHeight: '1.2'
                    }}>
                        Scan QR code for property details
                    </div>
                </div>

                {/* QR Code Section */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: `${85 * scale}px`
                }}>
                    <div style={{
                        background: 'white',
                        padding: `${4 * scale}px`,
                        borderRadius: `${4 * scale}px`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <QRCode
                            size={75 * scale}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={propertyData.qr_code_url}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Signature Area */}
            <div style={{
                position: 'absolute',
                bottom: `${4 * scale}px`,
                left: `${12 * scale}px`,
                right: `${12 * scale}px`,
                borderTop: `${1 * scale}px solid #ccc`,
                paddingTop: `${3 * scale}px`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{
                    fontSize: `${6 * scale}px`,
                    color: '#666',
                    textAlign: 'center'
                }}>
                    <div style={{ marginBottom: `${1 * scale}px` }}>_______________</div>
                    <div>Property Custodian</div>
                </div>
                <div style={{
                    fontSize: `${5 * scale}px`,
                    color: '#888',
                    textAlign: 'center'
                }}>
                    PARMS v1.0
                </div>
                <div style={{
                    fontSize: `${6 * scale}px`,
                    color: '#666',
                    textAlign: 'center'
                }}>
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
                    Official Property Sticker
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Preview */}
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div ref={stickerRef} style={{ transform: 'scale(0.7)', transformOrigin: 'center' }}>
                        <StickerContent scale={0.7} />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-center">
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Sticker
                    </Button>

                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                Full Preview
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Official Property Sticker - Full Size</DialogTitle>
                            </DialogHeader>
                            <div className="flex justify-center p-6 bg-gray-50">
                                <StickerContent />
                            </div>
                            <div className="flex gap-2 justify-center pt-4">
                                <Button onClick={handlePrint}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Sticker
                                </Button>
                                <Button variant="outline" onClick={handleDownload}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PNG
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                    Standard size: 4" × 2.5" - Ready for printing
                </div>
            </CardContent>
        </Card>
    );
}
