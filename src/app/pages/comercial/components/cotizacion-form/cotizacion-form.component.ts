import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { Comuna } from '../../../catalogos/models/comuna.model';
import { ServicioTipo } from '../../../catalogos/models/servicio-tipo.model';
import { CatalogosService } from '../../../catalogos/services/catalogos.service';
import { Cliente } from '../../../clientes/models/cliente.model';
import { ClientesService } from '../../../clientes/services/clientes.service';
import { ModalLoadingComponent } from '../../../uikit/components/modal-loading/modal-loading.component';
import { UnidadMedida } from '../../../uikit/models/unidad-medida.model';
import { UnidadesMedidasService } from '../../../uikit/services/unidades-medidas.service';
import { mensajeError } from '../../../uikit/utils/error-mensaje';
import { fechaIsoALocal, fechaIsoATexto, fechaLocalAIso } from '../../../uikit/utils/fechas';
import { Cotizacion, CotizacionEstado, estadoCotizacion } from '../../models/comercial.models';
import { ComercialService } from '../../services/comercial.service';

/** Revisar una solicitud de la web (o crear una interna), calcular con tarifas y registrar la respuesta. */
@Component({
    standalone: true,
    selector: 'app-cotizacion-form',
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        BreadcrumbModule,
        ButtonModule,
        ConfirmDialogModule,
        DatePickerModule,
        DialogModule,
        IconFieldModule,
        InputIconModule,
        InputNumberModule,
        InputTextModule,
        SelectModule,
        TagModule,
        TextareaModule,
        ToastModule,
        TooltipModule,
        ModalLoadingComponent
    ],
    templateUrl: './cotizacion-form.component.html',
    styleUrls: ['../../comercial.scss', './cotizacion-form.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class CotizacionFormComponent implements OnInit, OnDestroy {
    breadcrumb: MenuItem[] = [{ label: 'Home', icon: 'pi pi-home', routerLink: '/' }, { label: 'Comercial' }, { label: 'Cotizaciones', routerLink: '/comercial/cotizaciones' }];
    loading = false;
    intentoGuardar = false;
    cotizacion: Cotizacion = new Cotizacion();
    validaHasta: Date | undefined;
    detalleSugerido: string | undefined;
    correoHabilitado = false;
    private mapa: L.Map | undefined;
    private mapaEl: ElementRef<HTMLDivElement> | undefined;

    /** El div del mapa aparece solo si hay puntos: se dibuja al estar disponible. */
    @ViewChild('mapaTrayecto') set mapaRef(el: ElementRef<HTMLDivElement> | undefined) {
        this.mapaEl = el;
        if (el) setTimeout(() => this.dibujarMapa());
    }
    dialogoCorreo = false;
    mensajeCorreo = '';
    enviandoCorreo = false;

    comunas: Comuna[] = [];
    servicios: ServicioTipo[] = [];
    unidades: UnidadMedida[] = [];
    clientes: { id: number | undefined; nombre: string }[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private comercialService: ComercialService,
        private catalogosService: CatalogosService,
        private unidadesService: UnidadesMedidasService,
        private clientesService: ClientesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        forkJoin({
            comunas: this.catalogosService.getComunas(),
            servicios: this.catalogosService.getServiciosTipos(),
            unidades: this.unidadesService.getAll(),
            clientes: this.clientesService.getList()
        }).subscribe({
            next: (r) => {
                this.comunas = r.comunas;
                this.servicios = r.servicios;
                this.unidades = r.unidades;
                this.clientes = r.clientes.map((c: Cliente) => ({ id: c.id, nombre: c.nombreCorto || c.razonSocial }));
            }
        });
        this.comercialService.correoHabilitado().subscribe({ next: (r) => (this.correoHabilitado = r.habilitado), error: () => (this.correoHabilitado = false) });
        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'nueva') {
            this.cargar(id);
        } else {
            this.breadcrumb = [...this.breadcrumb, { label: 'Nueva' }];
        }
    }

    ngOnDestroy(): void {
        this.mapa?.remove();
    }

    get tienePuntos(): boolean {
        const c = this.cotizacion;
        return c.origenLatitud != null || c.destinoLatitud != null;
    }

    lugar(texto: string | undefined, comuna: string | undefined): string {
        if (!texto) return comuna || '—';
        return comuna && !texto.toLowerCase().includes(comuna.toLowerCase()) ? `${texto} (${comuna})` : texto;
    }

    private punto(lado: 'origen' | 'destino'): [number, number] | null {
        const c = this.cotizacion;
        const lat = lado === 'origen' ? c.origenLatitud : c.destinoLatitud;
        const lng = lado === 'origen' ? c.origenLongitud : c.destinoLongitud;
        return lat != null && lng != null ? [Number(lat), Number(lng)] : null;
    }

    enlaceMapa(tipo: 'origen' | 'destino' | 'trayecto'): string | null {
        const o = this.punto('origen');
        const d = this.punto('destino');
        if (tipo === 'trayecto') return o && d ? `https://www.google.com/maps/dir/?api=1&origin=${o.join(',')}&destination=${d.join(',')}` : null;
        const p = tipo === 'origen' ? o : d;
        return p ? `https://www.google.com/maps/search/?api=1&query=${p.join(',')}` : null;
    }

    private dibujarMapa() {
        if (!this.mapaEl) return;
        this.mapa?.remove();
        const o = this.punto('origen');
        const d = this.punto('destino');
        const mapa = L.map(this.mapaEl.nativeElement, { scrollWheelZoom: false, attributionControl: true });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap' }).addTo(mapa);
        const pin = (letra: string, color: string) =>
            L.divIcon({
                className: '',
                iconSize: [28, 28],
                iconAnchor: [14, 14],
                html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);color:#fff;font:800 12px system-ui;display:flex;align-items:center;justify-content:center">${letra}</div>`
            });
        if (o) L.marker(o, { icon: pin('A', '#2178bd') }).addTo(mapa);
        if (d) L.marker(d, { icon: pin('B', '#059669') }).addTo(mapa);
        if (o && d) {
            L.polyline([o, d], { color: '#2178bd', weight: 3, dashArray: '6 8' }).addTo(mapa);
            mapa.fitBounds(L.latLngBounds([o, d]), { padding: [30, 30], maxZoom: 14 });
        } else {
            mapa.setView((o ?? d)!, 14);
        }
        this.mapa = mapa;
    }

    get esNueva(): boolean {
        return !this.cotizacion.id;
    }

    get estado() {
        return estadoCotizacion(this.cotizacion.estado);
    }

    get cerrada(): boolean {
        return ['ACEPTADA', 'RECHAZADA', 'DESCARTADA'].includes(this.cotizacion.estado);
    }

    fecha(v: string | undefined) {
        return fechaIsoATexto(v);
    }

    cargar(id: string | number) {
        this.loading = true;
        this.comercialService.getCotizacion(id).subscribe({
            next: (c) => {
                this.cotizacion = c;
                this.validaHasta = fechaIsoALocal(c.validaHasta);
                this.breadcrumb = [...this.breadcrumb.slice(0, 3), { label: c.codigo }];
                this.loading = false;
            },
            error: (e) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(e, 'No se pudo obtener la cotización') });
            }
        });
    }

    guardar(despues?: () => void) {
        this.intentoGuardar = true;
        if (!this.cotizacion.nombre?.trim() || !this.cotizacion.email?.trim()) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Nombre y correo del solicitante son obligatorios' });
            return;
        }
        this.cotizacion.validaHasta = fechaLocalAIso(this.validaHasta);
        this.loading = true;
        this.comercialService.guardarCotizacion(this.cotizacion).subscribe({
            next: (c) => {
                this.loading = false;
                const eraNueva = this.esNueva;
                this.cotizacion = c;
                this.validaHasta = fechaIsoALocal(c.validaHasta);
                if (eraNueva) {
                    this.router.navigate(['/comercial/cotizaciones', c.id], { replaceUrl: true });
                }
                if (despues) {
                    despues();
                } else {
                    this.messageService.add({ severity: 'success', summary: 'Listo', detail: `Cotización ${c.codigo} guardada` });
                }
            },
            error: (e) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'No se pudo guardar', detail: mensajeError(e, 'Error al guardar'), life: 6000 });
            }
        });
    }

    /** Guarda y busca la tarifa que calza para proponer el monto. */
    calcular() {
        if (!this.cotizacion.servicioTipoId || !this.cotizacion.unidadMedidaId) {
            this.messageService.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Para calcular elige el servicio y la unidad (y la cantidad)' });
            return;
        }
        this.guardar(() =>
            this.comercialService.sugerir(this.cotizacion.id!).subscribe({
                next: (s) => {
                    this.detalleSugerido = s.detalle;
                    if (s.monto != null) {
                        this.cotizacion.monto = s.monto;
                        this.cotizacion.tarifaId = s.tarifa?.id;
                        this.messageService.add({ severity: 'info', summary: 'Monto calculado', detail: 'Revisa el monto y guarda la cotización' });
                    } else {
                        this.messageService.add({ severity: 'warn', summary: 'Sin tarifa', detail: s.detalle });
                    }
                },
                error: (e) => this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError(e, 'No se pudo calcular') })
            })
        );
    }

    cambiarEstado(estado: CotizacionEstado, confirmar: string) {
        this.confirmationService.confirm({
            key: 'cCotizacion',
            header: estadoCotizacion(estado).label,
            message: confirmar,
            accept: () =>
                this.guardar(() =>
                    this.comercialService.cambiarEstado(this.cotizacion.id!, estado).subscribe({
                        next: (c) => {
                            this.cotizacion = c;
                            this.validaHasta = fechaIsoALocal(c.validaHasta);
                            this.messageService.add({ severity: 'success', summary: 'Listo', detail: `Cotización marcada como ${estadoCotizacion(estado).label.toLowerCase()}` });
                        },
                        error: (e) => this.messageService.add({ severity: 'error', summary: 'No se pudo cambiar', detail: mensajeError(e, 'Error al cambiar el estado'), life: 6000 })
                    })
                )
        });
    }

    abrirCorreo() {
        if (this.cotizacion.monto == null) {
            this.messageService.add({ severity: 'warn', summary: 'Falta el monto', detail: 'Registra el monto antes de enviar la cotización' });
            return;
        }
        this.mensajeCorreo = 'Gracias por preferirnos. Te enviamos nuestra propuesta para el servicio solicitado.';
        this.dialogoCorreo = true;
    }

    /** Guarda los cambios y envía la cotización desde el servidor. */
    enviarCorreo() {
        this.enviandoCorreo = true;
        this.guardar(() =>
            this.comercialService.enviarPorCorreo(this.cotizacion.id!, this.mensajeCorreo).subscribe({
                next: (c) => {
                    this.enviandoCorreo = false;
                    this.dialogoCorreo = false;
                    this.cotizacion = c;
                    this.validaHasta = fechaIsoALocal(c.validaHasta);
                    this.messageService.add({ severity: 'success', summary: 'Correo enviado', detail: `Cotización ${c.codigo} enviada a ${c.email}` });
                },
                error: (e) => {
                    this.enviandoCorreo = false;
                    this.messageService.add({ severity: 'error', summary: 'No se pudo enviar', detail: mensajeError(e, 'Error al enviar el correo'), life: 7000 });
                }
            })
        );
        // si guardar() no pasó la validación, no queda el botón cargando
        if (!this.loading) this.enviandoCorreo = false;
    }

    /** Abre el correo con la propuesta para enviarla al solicitante. */
    get mailto(): string {
        const c = this.cotizacion;
        const monto = c.monto != null ? `$ ${Number(c.monto).toLocaleString('es-CL')} + IVA` : '(por definir)';
        const cuerpo = [
            `Estimado/a ${c.nombre}:`,
            '',
            `Junto con saludar, le enviamos la cotización ${c.codigo ?? ''} por el servicio solicitado:`,
            '',
            `Servicio: ${c.servicioTipoNombre || c.servicioTexto || ''}`,
            `Origen: ${c.comunaOrigenNombre || c.origen || ''}`,
            `Destino: ${c.comunaDestinoNombre || c.destino || ''}`,
            c.tipoCarga ? `Carga: ${c.tipoCarga}` : '',
            `Valor: ${monto}`,
            this.validaHasta ? `Válida hasta: ${this.validaHasta.toLocaleDateString('es-CL')}` : '',
            '',
            'Quedamos atentos a sus comentarios.',
            '',
            'Transportes Gomez Velásquez'
        ]
            .filter((l, i, arr) => l !== '' || arr[i - 1] !== '')
            .join('\n');
        return `mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent('Cotización ' + (c.codigo ?? ''))}&body=${encodeURIComponent(cuerpo)}`;
    }
}
