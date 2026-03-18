import type React from 'react';
import { GitCompareArrows } from 'lucide-react'; //icono de 2 flecas de comparacion
import { Button } from '@/components/ui/button';
import type { Property } from '@/types/property';

interface CompareButtonProps{
    property: Property;
    isSelected: boolean;
    onAdd: (property: Property) => void;
    onRemove: (id:string) => void;
    //true cuando ya hay 3 y esta propiedad no esta seleccionada
    disabled: boolean;
}

//boton que cambia de apariencia y compartamiento dependiendo si la 
//propiedad ya esta en la lista de comparacion o no
//recibe como parametro un objeto de tipo CompareButtonProps
export function CompareButton({
    property,
    isSelected,
    onAdd,
    onRemove,
    disabled,
}: CompareButtonProps): React.ReactElement{
    const handleClick = () => {
        if(isSelected){
            onRemove(property.id);
        }else{
            onAdd(property);
        }
    };
    
    return(
        <Button
            variant={isSelected ? 'default' : 'outline'}
            size="sm"
            onClick={handleClick}
            disabled={disabled && !isSelected}
            className="flex items-center gap-1"
            aria-label={isSelected ? 'Quitar de comparación' : 'Comparar propiedad'}
        >
            <GitCompareArrows className="h-4 w-4" />
            {isSelected ? 'Quitar' : 'Comparar'}
        </Button>
    );
}