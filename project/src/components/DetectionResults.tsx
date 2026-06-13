import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Target, Droplet, Fingerprint, Zap, Info } from 'lucide-react';

interface Detection {
  id: string;
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
  description: string;
  forensicSignificance: string;
}

interface AnalysisResult {
  detections: Detection[];
  imageUrl: string;
  timestamp: string;
  metadata: {
    resolution: string;
    fileSize: string;
    format: string;
  };
}

interface DetectionResultsProps {
  result: AnalysisResult;
}

const getEvidenceIcon = (className: string) => {
  switch (className.toLowerCase()) {
    case 'knife':
    case 'gun':
    case 'weapon':
      return AlertTriangle;
    case 'blood_stain':
    case 'blood':
      return Droplet;
    case 'fingerprint':
      return Fingerprint;
    case 'shell_casing':
      return Target;
    default:
      return Info;
  }
};

const getEvidenceColor = (className: string) => {
  switch (className.toLowerCase()) {
    case 'knife':
    case 'gun':
    case 'weapon':
      return 'red';
    case 'blood_stain':
    case 'blood':
      return 'red';
    case 'fingerprint':
      return 'blue';
    case 'shell_casing':
      return 'yellow';
    default:
      return 'gray';
  }
};

const colorClass = (color: string) => {
  const map: Record<string, { border: string; bg: string; text: string }> = {
    red: { border: 'border-red-400', bg: 'bg-red-500/20', text: 'text-red-400' },
    blue: { border: 'border-blue-400', bg: 'bg-blue-500/20', text: 'text-blue-400' },
    yellow: { border: 'border-yellow-400', bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    green: { border: 'border-green-400', bg: 'bg-green-500/20', text: 'text-green-400' },
    gray: { border: 'border-gray-400', bg: 'bg-gray-500/20', text: 'text-gray-400' },
  };
  return map[color] ?? map.gray;
};

const priorityClass = (color: string) => {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-400/30' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-400/30' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-400/30' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-400/30' },
    gray: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-400/30' },
  };
  return map[color] ?? map.gray;
};

const getPriorityLevel = (confidence: number, className: string) => {
  if (confidence > 0.9 && ['knife', 'gun', 'weapon'].includes(className.toLowerCase())) {
    return { level: 'CRITICAL', color: 'red' };
  } else if (confidence > 0.8) {
    return { level: 'HIGH', color: 'orange' };
  } else if (confidence > 0.7) {
    return { level: 'MEDIUM', color: 'yellow' };
  } else {
    return { level: 'LOW', color: 'green' };
  }
};

const DetectionResults: React.FC<DetectionResultsProps> = ({ result }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imageSize, setImageSize] = useState({
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
  });

  useEffect(() => {
    if (!imgRef.current) return;
    const img = imgRef.current;

    const updateSize = () => {
      setImageSize({
        width: img.offsetWidth,
        height: img.offsetHeight,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
    };

    if (img.complete) {
      updateSize();
    }

    img.addEventListener('load', updateSize);
    window.addEventListener('resize', updateSize);

    return () => {
      img.removeEventListener('load', updateSize);
      window.removeEventListener('resize', updateSize);
    };
  }, [result.imageUrl]);

  const getScaledBBox = ([x1, y1, x2, y2]: [number, number, number, number]) => {
    if (!imageSize.naturalWidth || !imageSize.naturalHeight) {
      return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 };
    }

    const scaleX = imageSize.width / imageSize.naturalWidth;
    const scaleY = imageSize.height / imageSize.naturalHeight;

    return {
      x: x1 * scaleX,
      y: y1 * scaleY,
      width: (x2 - x1) * scaleX,
      height: (y2 - y1) * scaleY,
    };
  };

  return (
    <div className="space-y-8">
      {/* Analysis Overview */}
      <div className="bg-black/20 backdrop-blur-xl border border-blue-400/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span>Detection Analysis</span>
          </h3>
          <div className="text-right text-sm text-slate-400">
            <p>Analyzed: {new Date(result.timestamp).toLocaleString()}</p>
            <p>Resolution: {result.metadata.resolution} | Size: {result.metadata.fileSize}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{result.detections.length}</div>
            <div className="text-sm text-slate-300">Items Detected</div>
          </div>
          <div className="bg-red-500/10 border border-red-400/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {result.detections.filter(d => getPriorityLevel(d.confidence, d.class).level === 'CRITICAL').length}
            </div>
            <div className="text-sm text-slate-300">Critical Evidence</div>
          </div>
          <div className="bg-green-500/10 border border-green-400/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.round(result.detections.reduce((acc, d) => acc + d.confidence, 0) / result.detections.length * 100)}%
            </div>
            <div className="text-sm text-slate-300">Avg Confidence</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-400/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {new Set(result.detections.map(d => d.class)).size}
            </div>
            <div className="text-sm text-slate-300">Evidence Types</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image with Detections */}
        <div className="bg-black/20 backdrop-blur-xl border border-blue-400/20 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-blue-400/20">
            <h4 className="font-semibold text-white">Evidence Visualization</h4>
          </div>
          <div className="relative">
            <img
              ref={imgRef}
              src={result.imageUrl}
              alt="Crime scene analysis"
              className="w-full h-auto"
            />
            {/* Detection Bounding Boxes */}
            {result.detections.map((detection) => {
              const { x, y, width, height } = getScaledBBox(detection.bbox);
              const color = getEvidenceColor(detection.class);
              const classes = colorClass(color);

              return (
                <div
                  key={detection.id}
                  className={`absolute border-2 ${classes.border}`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                >
                  <div className={`absolute -top-8 left-0 ${classes.bg} text-white px-2 py-1 rounded text-xs font-medium`}>
                    {detection.class} ({Math.round(detection.confidence * 100)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detection Details */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Evidence Catalog</h4>
          {result.detections.map((detection) => {
            const Icon = getEvidenceIcon(detection.class);
            const priority = getPriorityLevel(detection.confidence, detection.class);
            
            return (
              <div key={detection.id} className="bg-black/20 backdrop-blur-xl border border-blue-400/20 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  {(() => {
                    const color = getEvidenceColor(detection.class);
                    const classes = colorClass(color);
                    return (
                      <div className={`p-2 ${classes.bg} rounded-lg`}>
                        <Icon className={`w-5 h-5 ${classes.text}`} />
                      </div>
                    );
                  })()}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-white capitalize">
                        {detection.class.replace('_', ' ')}
                      </h5>
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const p = priorityClass(priority.color);
                          return (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.bg} ${p.text} border ${p.border}`}>
                              {priority.level}
                            </span>
                          );
                        })()}
                        <span className="text-sm text-slate-400">
                          {Math.round(detection.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{detection.description}</p>
                    <p className="text-xs text-blue-300 bg-blue-500/10 border border-blue-400/20 rounded-lg p-2">
                      <strong>Forensic Significance:</strong> {detection.forensicSignificance}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DetectionResults;

