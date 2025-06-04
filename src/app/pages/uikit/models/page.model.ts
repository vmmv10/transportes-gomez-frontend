export interface Page<T> {
    content: T[];              // Lista de resultados
    totalElements: number;     // Total de elementos en la BD
    totalPages: number;        // Total de páginas
    size: number;              // Tamaño de página solicitada
    number: number;            // Página actual (0-based)
    numberOfElements: number;  // Elementos en la página actual
    first: boolean;            // ¿Es la primera página?
    last: boolean;             // ¿Es la última página?
    empty: boolean;
}