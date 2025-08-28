import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Download, Printer, QrCode, ExternalLink } from 'lucide-react';
import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';

interface CompactQRCodeProps {
    url: string;
    propertyName: string;
    propertyNumber: string;
}

export default function CompactQRCode({ url, propertyName, propertyNumber }: CompactQRCodeProps) {
    const qrRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        if (!qrRef.current) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const qrElement = qrRef.current.cloneNode(true) as HTMLElement;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>QR Code - ${propertyName}</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 20px;
                            font-family: Arial, sans-serif;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                        }
                        .qr-container {
                            text-align: center;
                            border: 2px solid #000;
                            padding: 20px;
                            border-radius: 8px;
                            background: white;
                        }
                        .property-info {
                            margin-top: 15px;
                            font-size: 12px;
                            color: #333;
                        }
                        .property-name {
                            font-weight: bold;
                            font-size: 14px;
                            margin-bottom: 5px;
                        }
                        .property-number {
                            color: #666;
                        }
                        svg {
                            display: block;
                            margin: 0 auto;
                        }
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        ${qrElement.innerHTML}
                        <div class="property-info">
                            <div class="property-name">${propertyName}</div>
                            <div class="property-number">Property #${propertyNumber}</div>
                        </div>
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    const handleDownload = () => {
        if (!qrRef.current) return;

        const svg = qrRef.current.querySelector('svg');
        if (!svg) return;

        try {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            canvas.width = 140; // Smaller canvas for compact version
            canvas.height = 180; // Reduced height

            img.onload = function() {
                if (!ctx) return;

                // Fill background
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw QR code
                ctx.drawImage(img, 10, 10, 120, 120);

                // Add property info
                ctx.fillStyle = 'black';
                ctx.font = 'bold 10px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(propertyName.substring(0, 20), canvas.width / 2, 145);

                ctx.font = '8px Arial';
                ctx.fillStyle = '#666';
                ctx.fillText(`Property #${propertyNumber}`, canvas.width / 2, 160);

                // Download the image
                const link = document.createElement('a');
                link.download = `qr-code-${propertyNumber}.png`;
                link.href = canvas.toDataURL();
                link.click();

                toast.success('QR Code downloaded successfully!');
            };

            img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
        } catch (error) {
            console.error('Error downloading QR code:', error);
            toast.error('Failed to download QR code. Please try again.');
        }
    };

    const handleViewQR = () => {
        window.open(url, '_blank');
    };

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4" />
                        QR Code
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ExternalLink className="h-3 w-3" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <QrCode className="h-5 w-5" />
                                    Property QR Code
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div ref={qrRef} className="flex justify-center p-4 bg-white border border-gray-200 rounded-lg">
                                    <QRCode
                                        size={200}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        value={url}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium">{propertyName}</p>
                                    <p className="text-sm text-muted-foreground">Property #{propertyNumber}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handleViewQR} className="flex-1">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Open
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1">
                                        <Printer className="mr-2 h-4 w-4" />
                                        Print
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleDownload} className="flex-1">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <QRCode
                            size={80}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            value={url}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-2">
                            Scan to view property details
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleViewQR}
                            className="w-full h-8 text-xs"
                        >
                            <ExternalLink className="mr-2 h-3 w-3" />
                            Open Link
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
