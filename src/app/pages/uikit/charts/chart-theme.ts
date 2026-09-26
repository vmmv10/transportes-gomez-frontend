/**
 * Estilo común de los gráficos del sistema (Chart.js vía p-chart).
 * Una sola serie por gráfico => un solo tono: el azul de la marca.
 */
export const COLOR_MARCA = '#2178bd';
export const COLOR_MARCA_HOVER = '#185f97';

/** Lee una variable CSS del tema (sirve para modo claro y oscuro). */
function cssVar(nombre: string, respaldo: string): string {
    if (typeof window === 'undefined') {
        return respaldo;
    }
    const valor = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
    return valor || respaldo;
}

export interface OpcionesBarras {
    /** true = barras horizontales (rankings). */
    horizontal?: boolean;
    /** Texto de la unidad en el tooltip, ej. "entregas". */
    unidad: string;
    /** Máximo de caracteres de las etiquetas de categoría antes de cortar con "…". */
    maxEtiqueta?: number;
}

/** Dataset de barras con el estilo del sistema. */
export function datasetBarras(label: string, data: number[], horizontal = false) {
    return {
        label,
        data,
        backgroundColor: COLOR_MARCA,
        hoverBackgroundColor: COLOR_MARCA_HOVER,
        borderRadius: 4,
        // Solo se redondea el extremo del dato; la base queda recta sobre el eje
        borderSkipped: 'start',
        maxBarThickness: horizontal ? 16 : 22,
        categoryPercentage: 0.7,
        barPercentage: 0.9
    };
}

/** Opciones de Chart.js para un gráfico de barras de una serie. */
export function opcionesBarras({ horizontal = false, unidad, maxEtiqueta = 26 }: OpcionesBarras): any {
    const textoSecundario = cssVar('--text-color-secondary', '#64748b');
    const borde = cssVar('--surface-border', '#e2e8f0');
    const fuente = { family: "'Lato', sans-serif", size: 11 };

    const cortar = function (this: any, value: any) {
        const label: string = String(this.getLabelForValue(value) ?? '');
        return label.length > maxEtiqueta ? label.substring(0, maxEtiqueta - 1) + '…' : label;
    };

    const ejeCategorias = {
        ticks: {
            color: textoSecundario,
            font: fuente,
            autoSkip: !horizontal,
            maxRotation: 0,
            callback: cortar
        },
        grid: { display: false },
        border: { display: false }
    };

    const ejeValores = {
        beginAtZero: true,
        ticks: {
            color: textoSecundario,
            font: fuente,
            precision: 0,
            maxTicksLimit: 5
        },
        grid: { color: borde, drawTicks: false },
        border: { display: false }
    };

    return {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: horizontal ? 'y' : 'x',
        animation: { duration: 500, easing: 'easeOutQuart' },
        layout: { padding: { top: 4, right: 8 } },
        scales: horizontal ? { x: ejeValores, y: ejeCategorias } : { x: ejeCategorias, y: ejeValores },
        interaction: { mode: 'nearest', axis: horizontal ? 'y' : 'x', intersect: false },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0f172a',
                titleColor: '#f8fafc',
                bodyColor: '#e2e8f0',
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
                titleFont: { family: "'Lato', sans-serif", size: 12, weight: '700' },
                bodyFont: { family: "'Lato', sans-serif", size: 12 },
                callbacks: {
                    label: (context: any) => `${context.formattedValue} ${unidad}`
                }
            }
        }
    };
}

/** Alto sugerido para barras horizontales según la cantidad de categorías. */
export function altoHorizontal(cantidad: number, minRem = 8, porFilaRem = 1.9): string {
    return `${Math.max(minRem, cantidad * porFilaRem + 2)}rem`;
}
