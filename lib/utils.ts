import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type SupportedCurrency = 'PEN' | 'USD' | 'EUR';
type SupportedLocale = 'es-PE' | 'en-US' | 'de-DE';

/**
 * Combina clases de Tailwind usando clsx y twMerge, 
 * evitando duplicados o conflictos de utilidades.
 *
 * @param {...ClassValue[]} inputs - Lista de clases o condiciones.
 * @returns {string} Cadena de clases combinada.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Verifica si una dirección de correo electrónico tiene un formato válido.
 *
 * @param {string} email - Dirección de correo electrónico a verificar.
 * @returns {boolean} `true` si el formato es válido, de lo contrario `false`.
 */
export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}


/**
 * Restringe la entrada de un input a solo números enteros.
 * Permite teclas de navegación y manejo de "Enter".
 *
 * @param {React.KeyboardEvent<HTMLInputElement>} event - Evento de teclado en el input.
 * @param {() => void} [enterCallback] - Callback opcional al presionar Enter.
 */
export function keyNumberInteger(
  event: React.KeyboardEvent<HTMLInputElement>,
  enterCallback?: () => void
): void {
  const key = event.key
  const isDigit = /\d/.test(key)

  if (
    !(
      isDigit ||
      key === "Backspace" ||
      key === "Delete" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "Tab" ||
      ((event.ctrlKey || event.metaKey) && key === "c") ||
      ((event.ctrlKey || event.metaKey) && key === "v")
    )
  ) {
    event.preventDefault()
  }

  if (key === "Enter" && typeof enterCallback === "function") {
    enterCallback()
  }
}

/**
 * Valida el texto pegado en un input para aceptar solo números enteros.
 *
 * @param {React.ClipboardEvent<HTMLInputElement>} event - Evento de portapapeles.
 */
export function handlePasteInteger(event: React.ClipboardEvent<HTMLInputElement>): void {
  const pasteData = event.clipboardData.getData("text/plain")
  if (!/^\d+$/.test(pasteData)) {
    event.preventDefault()
  }
}

/**
 * Restringe la entrada a números decimales (flotantes).
 * Evita múltiples puntos y valida posición del punto decimal.
 *
 * @param {React.KeyboardEvent<HTMLInputElement>} event - Evento de teclado en el input.
 * @param {() => void} [enterCallback] - Callback opcional al presionar Enter.
 */
export function keyNumberFloat(
  event: React.KeyboardEvent<HTMLInputElement>,
  enterCallback?: () => void
): void {
  const key = event.key
  const isDigit = /\d/.test(key)
  const isDot = key === "."
  const hasDot = event.currentTarget.value.includes(".")

  if (
    !(
      isDigit ||
      isDot ||
      key === "Backspace" ||
      key === "Delete" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "Tab" ||
      ((event.ctrlKey || event.metaKey) && key === "c") ||
      ((event.ctrlKey || event.metaKey) && key === "v")
    )
  ) {
    event.preventDefault()
  }

  if (isDot && hasDot) {
    event.preventDefault()
  }

  if (event.currentTarget.selectionStart === 0 && isDot) {
    event.preventDefault()
  }

  if (key === "Enter" && typeof enterCallback === "function") {
    enterCallback()
  }
}

/**
 * Valida el texto pegado en un input para aceptar solo números flotantes.
 *
 * @param {React.ClipboardEvent<HTMLInputElement>} event - Evento de portapapeles.
 */
export function handlePasteFloat(event: React.ClipboardEvent<HTMLInputElement>): void {
  const pastedData = event.clipboardData?.getData("text")
  if (!/^(\d*\.?\d*)$/.test(pastedData)) {
    event.preventDefault()
  }
}

/**
 * Restringe la entrada a un número de teléfono (dígitos y símbolos válidos).
 *
 * @param {React.KeyboardEvent<HTMLInputElement>} event - Evento de teclado en el input.
 * @param {() => void} [enterCallback] - Callback opcional al presionar Enter.
 */
export function keyNumberPhone(
  event: React.KeyboardEvent<HTMLInputElement>,
  enterCallback?: () => void
): void {
  const key = event.key
  const inputValue = event.currentTarget.value

  const isDigitOrAllowedChar = /^[0-9+()-]$/.test(key)
  const charAlreadyExists = inputValue.includes(key)

  if ((key === "-" || key === "+") && charAlreadyExists) {
    event.preventDefault()
  }

  if (
    !(
      isDigitOrAllowedChar ||
      key === "Backspace" ||
      key === "Delete" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "Tab" ||
      ((event.ctrlKey || event.metaKey) && key === "c") ||
      ((event.ctrlKey || event.metaKey) && key === "v")
    )
  ) {
    event.preventDefault()
  }

  if (key === "Enter" && typeof enterCallback === "function") {
    enterCallback()
  }
}

/**
 * Obtiene la fecha actual en formato `YYYY-MM-DD`.
 *
 * @returns {string} Fecha formateada.
 */
export function currentDate(): string {
  const date = new Date();
  return parseFormatDate(date);
}

/**
 * Obtiene la hora actual en formato `HH:mm:ss`.
 *
 * @returns {string} Hora formateada.
 */
export function currentTime(): string {
  const time = new Date();
  const hours = time.getHours() > 9 ? time.getHours() : '0' + time.getHours();
  const minutes =
    time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes();
  const seconds =
    time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds();
  const formatted_time = `${hours}:${minutes}:${seconds}`;
  return formatted_time;
}

function parseFormatDate(date: Date) {
  const year = date.getFullYear();
  const month = padZeroes(date.getMonth() + 1);
  const day = padZeroes(date.getDate());
  return `${year}-${month}-${day}`;
}

function padZeroes(num: number) {
  return num > 9 ? num : '0' + num;
}

/**
 * Genera ranuras de tiempo cada hora desde las 07:00 hasta las 23:00.
 *
 * @returns {string[]} Lista de horas en formato `HH:mm:ss`.
 */
export function timeSlots(): string[] {
  const ranurasDeTiempo = []
  for (let hour = 7; hour <= 23; hour++) {
    for (let minute = 0; minute < 60; minute += 60) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`
      ranurasDeTiempo.push(timeString)
    }
  }
  return ranurasDeTiempo
}

/**
 * Verifica si un valor es numérico válido.
 *
 * @param {*} valor - Valor a evaluar.
 * @returns {boolean} True si es número, false si no.
 */
export function isNumeric(valor: any): boolean {
  return !isNaN(valor) && !isNaN(parseFloat(valor));
}

/**
 * Formatea un número como dinero en la moneda especificada.
 *
 * @param {number} value - Valor a formatear.
 * @param {string} [currency="PEN"] - Moneda (PEN, USD, EUR).
 * @returns {string} Cadena formateada como dinero.
 */
export const formatCurrency = (value: number, currency: string = "PEN"): string => {
  if (!isNumeric(value)) {
    return "MN " + formatDecimal(value.toString());
  }

  const formats: {
    locales: SupportedLocale;
    options: Intl.NumberFormatOptions & { currency: SupportedCurrency };
  }[] = [
      {
        locales: 'es-PE',
        options: { style: 'currency', currency: 'PEN', minimumFractionDigits: 2 },
      },
      {
        locales: 'en-US',
        options: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
      },
      {
        locales: 'de-DE',
        options: { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 },
      },
    ];

  const newFormat = formats.find((item) => currency === item.options.currency);

  if (newFormat) {
    const formatter = new Intl.NumberFormat(newFormat.locales, newFormat.options);
    return formatter.format(value).replace(/\s/g, '');
  } else {
    return 'MN ' + formatDecimal(value.toString());
  }
}

/**
 * Formatea un número en string con separadores de miles y decimales personalizados.
 *
 * @param {string} amount - Cantidad en string.
 * @param {number} [decimalCount=2] - Número de decimales.
 * @param {string} [decimal="."] - Separador decimal.
 * @param {string} [thousands=","] - Separador de miles.
 * @returns {string} Número formateado.
 */
export function formatDecimal(
  amount: string,
  decimalCount: number = 2,
  decimal: string = '.',
  thousands: string = ',',
): string {
  const isNumber = /^-?\d*\.?\d+$/.test(amount);
  if (!isNumber) return '0.00';

  decimalCount = Number.isInteger(decimalCount) ? Math.abs(decimalCount) : 2;

  const number = Number(amount);

  const negativeSign = number < 0 ? '-' : '';

  const valueRounded = rounded(number.toString(), decimalCount);

  const roundedAmount = Math.abs(valueRounded).toFixed(
    decimalCount,
  );
  const [integerPart, decimalPart] = roundedAmount.split('.');

  const integerFormatted = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousands,
  );
  const decimalFormatted = decimalCount
    ? decimal + (decimalPart || '0'.repeat(decimalCount))
    : '';

  return negativeSign + integerFormatted + decimalFormatted;
}

/**
 * Redondea un número a la cantidad de decimales especificada.
 *
 * @param {string} amount - Cantidad en string.
 * @param {number} [decimalCount=2] - Número de decimales.
 * @returns {number} Valor redondeado.
 */
export function rounded(amount: string, decimalCount: number = 2): number {
  const isNumber = /^-?\d*\.?\d+$/.test(amount);
  if (!isNumber) return 0;

  const number = Number(amount);

  decimalCount = Number.isInteger(decimalCount) ? Math.abs(decimalCount) : 2;

  const negativeSign = number < 0 ? '-' : '';

  const parsedAmount = Math.abs(number);
  const fixedAmount = parsedAmount.toFixed(decimalCount);

  const value = negativeSign + fixedAmount;

  return Number(value);
}

/**
 * Formatea una cadena de tiempo en un formato de 12 horas (por defecto) o de 24 horas.
 *
 * @param {string} time - La cadena de tiempo en formato "HH:mm" o "HH:mm:ss".
 * @param {boolean} [addSeconds=false] - Indica si se deben incluir los segundos en la salida.
 * @returns {string} La cadena de tiempo formateada.
 */
export function formatTime(time: string, addSeconds: boolean = false): string {
  const timeRegex =
    /^(0\d|1\d|2[0-4]):((0[0-9])|([1-5][0-9])|59)(?::([0-5][0-9]))?$/;
  const match = time.match(timeRegex);

  if (!match) {
    return 'Invalid Time';
  }

  const parts = time.split(':');

  const HH = Number(parts[0]);
  const mm = parts[1];
  const ss = parts[2] === undefined ? '00' : parts[2];

  const thf = HH % 12 || 12;
  const ampm = HH < 12 || HH === 24 ? 'AM' : 'PM';
  const formattedHour = thf < 10 ? '0' + thf : thf;

  if (addSeconds) {
    return `${formattedHour}:${mm}:${ss} ${ampm}`;
  }

  return `${formattedHour}:${mm} ${ampm}`;
}