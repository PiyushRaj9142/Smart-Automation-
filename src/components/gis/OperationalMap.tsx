import React from 'react';
import { CadastralMap } from './CadastralMap';
import { CadastralParcel } from '../../types/cadastre';

interface OperationalMapProps {
  height?: string;
  className?: string;
  showControls?: boolean;
  onParcelSelect?: (parcel: CadastralParcel) => void;
  onEntityClick?: (entity: any) => void;
}

export const OperationalMap: React.FC<OperationalMapProps> = ({
  height = 'h-[620px]',
  className = '',
  showControls = true,
  onParcelSelect,
  onEntityClick
}) => {
  return (
    <CadastralMap
      height={height}
      className={className}
      showControls={showControls}
      onParcelSelect={(parcel) => {
        if (onParcelSelect) onParcelSelect(parcel);
        if (onEntityClick) onEntityClick(parcel);
      }}
    />
  );
};

export default OperationalMap;
