// File: C:\Users\MARVIN\projects\parms\resources\js\components\property\ui\consolidated-qr-sticker.tsx

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
    const previewRef = useRef<HTMLDivElement>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const handleOpenQR = () => {
        // Open the public property view in a new tab
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

    const StickerPreview = ({ scale = 1 }: { scale?: number }) => {
        const px = (n: number) => `${n * scale}px`;

        return (
            <div
                className="sticker"
                style={{
                    width: `${4 * scale}in`,
                    height: `${2.5 * scale}in`,
                    backgroundImage: 'linear-gradient(180deg, rgba(21, 101, 192, 0.65) 0%, rgba(13, 72, 161, 0.81) 50%, rgba(5, 4, 42, 1) 100%), url(/assets/img/bg-ched.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    border: `${1 * scale}px solid #1565c0`,
                    borderRadius: px(12),
                    padding: px(14),
                    boxSizing: 'border-box',
                    position: 'relative',
                    fontFamily: "'Inter', 'Segoe UI', 'Arial', sans-serif",
                    boxShadow: scale === 1 ? '0 8px 24px rgba(21, 101, 192, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
                    color: '#ffffff',
                    overflow: 'hidden',
                }}
            >
                {/* Decorative corner elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: px(40),
                        height: px(40),
                        background: 'linear-gradient(135deg, #1565c0ff 0%, transparent 70%)',
                        borderRadius: `0 0 ${px(20)} 0`,
                        opacity: 0.1,
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: px(40),
                        height: px(40),
                        background: 'linear-gradient(225deg, #1565c0 0%, transparent 70%)',
                        borderRadius: `0 0 0 ${px(20)}`,
                        opacity: 0.1,
                    }}
                />

                {/* TOP BAR: Enhanced header with consistent white backgrounds for both logos */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `${px(38)} 1fr ${px(38)}`,
                        alignItems: 'center',
                        gap: px(10),
                        marginBottom: px(8),
                        position: 'relative',
                    }}
                >
                    {/* Left logo (Bagong Pilipinas) - Now with white background like CHED logo */}
                    <div
                        style={{
                            height: px(36),
                            width: px(36),
                            background: 'rgba(255, 255, 255, 0.9)', // Changed to white background like CHED
                            borderRadius: px(8),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(21, 101, 192, 0.15)',
                            backdropFilter: 'blur(10px)',
                            border: `${1 * scale}px solid rgba(255, 255, 255, 0.5)`,
                        }}
                    >
                        <img
                            src="/assets/img/bagong-pilipinas.png"
                            alt="Bagong Pilipinas"
                            style={{
                                width: px(30), // Adjusted to match CHED logo size
                                height: px(30), // Adjusted to match CHED logo size
                                objectFit: 'contain',
                            }}
                        />
                    </div>

                    {/* Center heading - Enhanced typography */}
                    <div style={{ textAlign: 'center', position: 'relative' }}>
                        <div
                            style={{
                                fontSize: px(10),
                                fontWeight: 800,
                                color: '#ffffff',
                                lineHeight: 1.1,
                                textTransform: 'uppercase',
                                letterSpacing: px(0.5),
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            Republic of the Philippines
                        </div>
                        <div
                            style={{
                                fontSize: px(8.5),
                                fontWeight: 700,
                                color: '#e3f2fd',
                                lineHeight: 1.1,
                                marginTop: px(2),
                                textTransform: 'uppercase',
                                letterSpacing: px(0.3),
                                textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
                            }}
                        >
                            COMMISSION ON HIGHER EDUCATION
                        </div>
                        <div
                            style={{
                                fontSize: px(7),
                                color: '#bbdefb',
                                lineHeight: 1.1,
                                marginTop: px(1),
                                fontWeight: 500,
                                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            Regional Office No. 12, Koronadal City
                        </div>

                        {/* Thinner underline accent with gradient */}
                        <div
                            style={{
                                height: px(1.5), // Made thinner (was px(3))
                                background: 'linear-gradient(90deg, #ffffff 0%, #e3f2fd 50%, #ffffff 100%)',
                                width: '75%',
                                margin: `${px(6)} auto 0`,
                                borderRadius: px(1),
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                            }}
                        />
                    </div>

                    {/* Right logo (CHED) */}
                    <div
                        style={{
                            height: px(36),
                            width: px(36),
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: px(8),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            boxShadow: '0 2px 8px rgba(21, 101, 192, 0.15)',
                            backdropFilter: 'blur(10px)',
                            border: `${1 * scale}px solid rgba(255, 255, 255, 0.5)`,
                        }}
                    >
                        <img
                            src="/assets/img/ched-logo.png"
                            alt="CHED"
                            style={{
                                width: px(30),
                                height: px(30),
                                objectFit: 'contain',
                            }}
                        />
                    </div>
                </div>

                {/* MAIN ROW - Enhanced layout */}
                <div
                    style={{
                        display: 'flex',
                        gap: px(14),
                        alignItems: 'stretch',
                        height: `calc(100% - ${px(110)})`,
                        paddingTop: px(4),
                    }}
                >
                    {/* LEFT: Article & Property No. - Enhanced styling */}
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                            borderRadius: px(10),
                            padding: px(12),
                            backdropFilter: 'blur(10px)',
                            border: `${1 * scale}px solid rgba(255, 255, 255, 0.2)`,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        {/* Article */}
                        <div>
                            <div
                                style={{
                                    fontSize: px(8.5),
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    letterSpacing: px(0.8),
                                    marginBottom: px(4),
                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                                }}
                            >
                                Article
                            </div>
                            <div
                                style={{
                                    fontSize: px(13),
                                    fontWeight: 900,
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    lineHeight: 1.0,
                                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                                    letterSpacing: px(0.5),
                                }}
                            >
                                {propertyData.item_name}
                            </div>
                        </div>

                        {/* Property No. */}
                        <div>
                            <div
                                style={{
                                    fontSize: px(8.5),
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    textTransform: 'uppercase',
                                    letterSpacing: px(0.8),
                                    marginBottom: px(4),
                                    marginTop: px(7),
                                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                                }}
                            >
                                Property No.
                            </div>
                            <div
                                style={{
                                    fontSize: px(11.5),
                                    fontWeight: 800,
                                    color: '#0d47a1',
                                    lineHeight: 1.1,
                                    letterSpacing: px(0.5),
                                    fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    padding: `${px(2)} ${px(6)}`,
                                    borderRadius: px(4),
                                    border: `${1 * scale}px solid rgba(255, 255, 255, 0.3)`,
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                                }}
                            >
                                {propertyData.property_number}
                            </div>
                        </div>

                        <div
                            style={{
                                fontSize: px(6.5),
                                color: '#ffffff',
                                fontStyle: 'italic',
                                lineHeight: 1.3,
                                marginTop: px(18),
                                textAlign: 'center',
                                textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
                                fontWeight: 500,
                            }}
                        >
                            Scan QR code for property details
                        </div>
                    </div>

                    {/* RIGHT: Enhanced QR Code */}
                    <div
                        style={{
                            minWidth: px(100),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            style={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                                padding: px(8),
                                borderRadius: px(12),
                                boxShadow: '0 4px 12px rgba(21, 101, 192, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
                                border: `${2 * scale}px solid rgba(21, 101, 192, 0.15)`,
                                position: 'relative',
                            }}
                        >
                            {/* QR code corner accents */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: px(3),
                                    left: px(3),
                                    width: px(8),
                                    height: px(8),
                                    border: `${1 * scale}px solid #1565c0`,
                                    borderRight: 'none',
                                    borderBottom: 'none',
                                    borderRadius: `${px(2)} 0 0 0`,
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: px(3),
                                    right: px(3),
                                    width: px(8),
                                    height: px(8),
                                    border: `${1 * scale}px solid #1565c0`,
                                    borderLeft: 'none',
                                    borderBottom: 'none',
                                    borderRadius: `0 ${px(2)} 0 0`,
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: px(3),
                                    left: px(3),
                                    width: px(8),
                                    height: px(8),
                                    border: `${1 * scale}px solid #1565c0`,
                                    borderRight: 'none',
                                    borderTop: 'none',
                                    borderRadius: `0 0 0 ${px(2)}`,
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: px(3),
                                    right: px(3),
                                    width: px(8),
                                    height: px(8),
                                    border: `${1 * scale}px solid #1565c0`,
                                    borderLeft: 'none',
                                    borderTop: 'none',
                                    borderRadius: `0 0 ${px(2)} 0`,
                                }}
                            />
                            <QRCode
                                size={84 * scale}
                                style={{
                                    height: 'auto',
                                    maxWidth: '100%',
                                    width: '100%',
                                    filter: 'contrast(1.1)',
                                }}
                                value={propertyData.qr_code_url}
                                viewBox="0 0 256 256"
                            />
                        </div>
                    </div>
                </div>

                {/* FOOTER – Perfectly centered 3 signatories */}
                <div
                    style={{
                        position: 'absolute',
                        left: px(12),
                        right: px(12),
                        bottom: px(10),
                        borderTop: `${1.5 * scale}px solid rgba(255, 255, 255, 0.4)`,
                        paddingTop: px(2),
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1.3fr',
                        gap: px(8),
                        alignItems: 'center',
                        background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.12) 50%, rgba(255, 255, 255, 0.08) 100%)',
                        borderRadius: px(8),
                        backdropFilter: 'blur(8px)',
                        height: px(45),
                        marginTop: px(5),
                    }}
                >
                    {/* COA Auditor */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            fontSize: px(7),
                            color: '#ffffff',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                            fontWeight: 500,
                            marginBottom: px(2),
                        }}>
                            ______________________
                        </div>
                        <div style={{
                            fontSize: px(7),
                            color: '#e3f2fd',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: px(0.4),
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                            lineHeight: 1.1,
                        }}>
                            COA AUDITOR
                        </div>
                    </div>

                    {/* Accountant II */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            fontSize: px(7),
                            color: '#ffffff',
                            fontWeight: 800,
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                            lineHeight: 1.1,
                            marginBottom: px(2),
                        }}>
                            Glaiza S. Ondoy
                        </div>
                        <div style={{
                            fontSize: px(7),
                            color: '#e3f2fd',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: px(0.4),
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                            lineHeight: 1.1,
                        }}>
                            ACCOUNTANT II
                        </div>
                    </div>

                    {/* Chief Administrative Officer */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            fontSize: px(6.5),
                            color: '#ffffff',
                            fontWeight: 800,
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                            lineHeight: 1.1,
                            marginBottom: px(2),
                        }}>
                            Maria Teresa L. Samonte, Ed.D.
                        </div>
                        <div style={{
                            fontSize: px(6.2),
                            color: '#e3f2fd',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: px(0.1),
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
                            lineHeight: 1.1,
                        }}>
                            CHIEF ADMINISTRATIVE OFFICER
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 to-white">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-blue-700">
                    <QrCode className="h-5 w-5" />
                    QR Code & Official Sticker
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Quick QR - Enhanced */}
                <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-white p-4 shadow-sm">
                    <div className="flex-shrink-0 rounded-lg bg-white p-2 shadow-md">
                        <QRCode
                            size={80}
                            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                            value={propertyData.qr_code_url}
                            viewBox="0 0 256 256"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="mb-3 text-sm text-blue-600 font-medium">📱 Permanent QR code — Always shows current property info</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleOpenQR}
                            className="h-8 w-full text-xs border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                        >
                            <ExternalLink className="mr-2 h-3 w-3" />
                            View Public Page
                        </Button>
                    </div>
                </div>

                {/* Official Sticker Preview - Enhanced and Fixed */}
                <div>
                    <h4 className="mb-3 text-sm font-semibold text-blue-700">Official Property Sticker</h4>
                    <div className="flex justify-center rounded-xl border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50/30 to-white p-4 shadow-inner">
                        <div
                            ref={previewRef}
                            style={{
                                transform: 'scale(0.85)',
                                transformOrigin: 'center',
                                maxWidth: '100%',
                                width: 'fit-content'
                            }}
                        >
                            <StickerPreview scale={0.85} />
                        </div>
                    </div>
                </div>

                {/* Hidden full-size print target */}
                <div aria-hidden className="pointer-events-none fixed top-0 -left-[10000px]">
                    <div ref={printRef}>
                        <StickerPreview />
                    </div>
                </div>

                {/* Enhanced Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm"
                    >
                        <Printer className="mr-2 h-4 w-4" />
                        Print Sticker
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="default"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-sm"
                            >
                                Full Preview
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl border-blue-100" aria-describedby={undefined}>
                            <DialogHeader>
                                <DialogTitle className="text-blue-700">Official Property Sticker - Full Size</DialogTitle>
                                <DialogDescription className="sr-only">
                                    Full-size preview of the property sticker to verify before printing.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center bg-gradient-to-br from-blue-50/50 to-white p-8 rounded-lg">
                                <StickerPreview />
                            </div>
                            <div className="flex justify-center gap-3 pt-4">
                                <Button
                                    onClick={handlePrint}
                                    className="bg-blue-600 hover:bg-blue-700 shadow-sm"
                                >
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Sticker
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleOpenQR}
                                    className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm"
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Public Page
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="text-center text-xs text-blue-600/70 bg-blue-50/50 rounded-lg p-2 space-y-1">
                    <div>📏 Standard size: 4" × 2.5" — A4 sheet fits 8 stickers (2×4 layout)</div>
                    <div className="font-semibold text-green-700">✅ QR Code is permanent — No need to replace when property details change</div>
                </div>
            </CardContent>
        </Card>
    );
}
