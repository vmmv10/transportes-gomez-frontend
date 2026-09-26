/** Utilidades para RUT chileno (formato 12345678-9, dígito verificador módulo 11). */

/** Quita puntos y espacios, pasa a mayúsculas y agrega el guion antes del dígito verificador. */
export function normalizarRut(rut: string | undefined | null): string {
    if (!rut) {
        return '';
    }
    const limpio = rut.replace(/[.\s-]/g, '').toUpperCase();
    if (limpio.length < 2) {
        return limpio;
    }
    return `${limpio.slice(0, -1)}-${limpio.slice(-1)}`;
}

/** Valida el dígito verificador (módulo 11). */
export function rutValido(rut: string | undefined | null): boolean {
    const normalizado = normalizarRut(rut);
    const partes = normalizado.split('-');
    if (partes.length !== 2 || !/^\d{1,8}$/.test(partes[0]) || !/^[\dK]$/.test(partes[1])) {
        return false;
    }
    let suma = 0;
    let multiplicador = 2;
    for (let i = partes[0].length - 1; i >= 0; i--) {
        suma += Number(partes[0][i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = 11 - (suma % 11);
    const dv = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return dv === partes[1];
}

/** 61981360-K -> 61.981.360-K (solo para mostrar). */
export function formatearRut(rut: string | undefined | null): string {
    const normalizado = normalizarRut(rut);
    const [cuerpo, dv] = normalizado.split('-');
    if (!cuerpo || dv === undefined) {
        return rut ?? '';
    }
    return `${cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
}
