import type React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Property } from '@/types/property';
import { PROPERTY_TYPE_LABELS, OPERATION_TYPE_LABELS } from '@/types/property';
import { formatPrice, formatArea } from '@/lib/utils';

interface ComparePageProps {
  compareList: Property[];
  onRemove: (id: string) => void;
}

//filas que se van a mostrar en la tabla
//label texto visible, key campo de Property, format función opcional
const COMPARE_ROWS: {
  label: string;
  render: (p: Property) => string | number;
  highlight?: 'min' | 'max'; //que valor es el mejor
}[] = [
  {
    label: 'Tipo',
    render: (p) => PROPERTY_TYPE_LABELS[p.propertyType],
  },
  {
    label: 'Operación',
    render: (p) => OPERATION_TYPE_LABELS[p.operationType],
  },
  {
    label: 'Precio',
    render: (p) => formatPrice(p.price),
    highlight: 'min', //menor precio es mejor
  },
  {
    label: 'Habitaciones',
    render: (p) => p.bedrooms,
    highlight: 'max', //más habitaciones es mejor
  },
  {
    label: 'Baños',
    render: (p) => p.bathrooms,
    highlight: 'max',
  },
  {
    label: 'Área',
    render: (p) => formatArea(p.area),
    highlight: 'max', //mayor área es mejor
  },
  {
    label: 'Precio/m²',
    render: (p) => formatPrice(Math.round(p.price / p.area)),
    highlight: 'min', //menor precio por m² es mejor
  },
  {
    label: 'Ciudad',
    render: (p) => p.city,
  },
];

export function ComparePage({ compareList, onRemove }: ComparePageProps): React.ReactElement {
  //Cuando esta vacio
  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground text-lg mb-4">
          No hay propiedades seleccionadas para comparar
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    );
  }

  //para cada fila con highlight se calcula que columna es la mejor
  const getBestIndex = (row: typeof COMPARE_ROWS[number]): number => {
    //si no hay highlight
    if (!row.highlight) return -1;

    //Se obtiene el valor numérico para poder comparar
    const values = compareList.map((p) => {
      if (row.label === 'Precio') return p.price;
      if (row.label === 'Precio/m²') return Math.round(p.price / p.area);
      if (row.label === 'Habitaciones') return p.bedrooms;
      if (row.label === 'Baños') return p.bathrooms;
      if (row.label === 'Área') return p.area;
      return 0;
    });

    //encuentra el mejor valor y retorna su posicion
    const best = row.highlight === 'min' ? Math.min(...values) : Math.max(...values);
    return values.indexOf(best);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Comparar Propiedades</h1>
          <p className="text-muted-foreground">
            Comparando {compareList.length} {compareList.length === 1 ? 'propiedad' : 'propiedades'}
          </p>
        </div>
      </div>

      {/* Tabla de comparación */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {/* Columna de etiquetas */}
              <th className="text-left p-4 bg-muted rounded-tl-lg w-32"></th>

              {/* Una columna por propiedad */}
              {compareList.map((property) => {
                const imageUrl =
                  property.images?.[0] ??
                  `https://placehold.co/800x600/e2e8f0/64748b?text=${encodeURIComponent(property.propertyType)}`;

                return (
                  <th key={property.id} className="p-4 bg-muted text-center min-w-48">
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={imageUrl}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <span className="font-semibold text-sm line-clamp-2">{property.title}</span>
                      {/* Botón para quitar de la comparación */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(property.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Quitar
                      </Button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {COMPARE_ROWS.map((row, rowIndex) => {
              const bestIndex = getBestIndex(row);

              return (
                <tr
                  key={row.label}
                  className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                >
                  {/* Etiqueta de la fila */}
                  <td className="p-4 font-medium text-sm text-muted-foreground">
                    {row.label}
                  </td>

                  {/* Valor por cada propiedad */}
                  {compareList.map((property, colIndex) => {
                    const isBest = bestIndex === colIndex;
                    return (
                      <td
                        key={property.id}
                        className={`p-4 text-center text-sm ${
                          isBest
                            ? 'font-bold text-green-600 bg-green-50'
                            : ''
                        }`}
                      >
                        {row.render(property)}
                        {/* Indicador visual del mejor valor */}
                        {isBest && (
                          <span className="ml-1 text-xs text-green-600">✓</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Links a detalle */}
      <div className="flex gap-4 mt-8 justify-end">
        {compareList.map((property) => (
          <Button key={property.id} asChild variant="outline">
            <Link to={`/property/${property.id}`}>
              Ver detalle: {property.title.slice(0, 20)}...
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}