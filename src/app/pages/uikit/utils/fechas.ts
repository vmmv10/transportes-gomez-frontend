/** Convierte 'yyyy-MM-dd' en Date local (sin correr el día por la zona horaria). */
export function fechaIsoALocal(valor: string | undefined | null): Date | undefined {
    if (!valor) {
        return undefined;
    }
    const [anio, mes, dia] = valor.substring(0, 10).split('-').map(Number);
    if (!anio || !mes || !dia) {
        return undefined;
    }
    return new Date(anio, mes - 1, dia);
}

/** Convierte una Date local en 'yyyy-MM-dd'. */
export function fechaLocalAIso(fecha: Date | undefined | null): string | undefined {
    if (!fecha) {
        return undefined;
    }
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** 'yyyy-MM-dd' -> 'dd-MM-yyyy' para mostrar. */
export function fechaIsoATexto(valor: string | undefined | null): string {
    if (!valor) {
        return '';
    }
    const [anio, mes, dia] = valor.substring(0, 10).split('-');
    return `${dia}-${mes}-${anio}`;
}
