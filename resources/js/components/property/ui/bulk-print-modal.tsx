import { useRef, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';

interface PropertyData {
    id: string;
    item_name: string;
    property_number: string;
    qr_code_url: string;
    location?: string;
    user?: string;
}

interface BulkPrintModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedProperties: PropertyData[];
    onRemoveProperty: (propertyId: string) => void;
    onClearAll: () => void;
}

// Individual sticker component for bulk printing
const BulkSticker = ({ propertyData, scale = 1 }: { propertyData: PropertyData; scale?: number }) => {
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
                color: '#ffffff',
                overflow: 'hidden',
                pageBreakInside: 'avoid',
                breakInside: 'avoid',
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

            {/* TOP BAR */}
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
                {/* Left logo */}
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
                        src="/assets/img/bagong-pilipinas.png"
                        alt="Bagong Pilipinas"
                        style={{
                            width: px(30),
                            height: px(30),
                            objectFit: 'contain',
                        }}
                    />
                </div>

                {/* Center heading */}
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

                    <div
                        style={{
                            height: px(1.5),
                            background: 'linear-gradient(90deg, #ffffff 0%, #e3f2fd 50%, #ffffff 100%)',
                            width: '75%',
                            margin: `${px(6)} auto 0`,
                            borderRadius: px(1),
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                        }}
                    />
                </div>

                {/* Right logo */}
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

            {/* MAIN ROW */}
            <div
                style={{
                    display: 'flex',
                    gap: px(14),
                    alignItems: 'stretch',
                    height: `calc(100% - ${px(110)})`,
                    paddingTop: px(4),
                }}
            >
                {/* LEFT: Article & Property No. */}
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

                {/* RIGHT: QR Code */}
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

            {/* FOOTER */}
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

// Bulk print layout component
const BulkPrintLayout = ({ properties }: { properties: PropertyData[] }) => {
    const stickersPerPage = 8; // 2 columns × 4 rows for A4
    const pages: PropertyData[][] = [];

    // Group properties into pages
    for (let i = 0; i < properties.length; i += stickersPerPage) {
        pages.push(properties.slice(i, i + stickersPerPage));
    }

    return (
        <div>
            {pages.map((pageProperties, pageIndex) => (
                <div
                    key={pageIndex}
                    style={{
                        width: '210mm', // A4 width
                        minHeight: '297mm', // A4 height
                        padding: '5mm',
                        boxSizing: 'border-box',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr', // 2 columns
                        gridTemplateRows: 'repeat(4, 1fr)', // 4 rows
                        gap: '2mm',
                        pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto',
                        pageBreakInside: 'avoid',
                    }}
                >
                    {pageProperties.map((property) => (
                        <div
                            key={property.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <BulkSticker propertyData={property} scale={1} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default function BulkPrintModal({
    open,
    onOpenChange,
    selectedProperties,
    onRemoveProperty,
    onClearAll
}: BulkPrintModalProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Bulk Property Stickers - ${selectedProperties.length} items`,
        pageStyle: `
            @page {
                margin: 0;
                size: A4;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    margin: 0;
                }
                * {
                    page-break-inside: avoid;
                }
            }
        `,
        onAfterPrint: () => {
            toast.success(`${selectedProperties.length} stickers sent to printer`);
            onOpenChange(false);
            onClearAll();
        },
        onPrintError: () => {
            toast.error('Print canceled or failed');
            onOpenChange(false);
        }
    });

    // Trigger print immediately when modal opens
    useEffect(() => {
        if (open && selectedProperties.length > 0) {
            handlePrint();
        }
    }, [open]);

    return (
        <>
            {/* Hidden print content */}
            <div className="fixed -left-[10000px] top-0 pointer-events-none" aria-hidden="true">
                <div ref={printRef}>
                    <BulkPrintLayout properties={selectedProperties} />
                </div>
            </div>
        </>
    );
}
