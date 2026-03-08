import React from "react";

// Mapeo de los bloques según tu base de datos
const BLOQUES_PRIMARIA = {
  1: { titulo: "Áreas Académicas", ids: [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115] },
  2: { titulo: "Áreas Extracurriculares", ids: [116, 117] },
  3: { titulo: "Responsabilidades del estudiante con su comportamiento", ids: [118, 119, 120, 121, 122] },
  4: { titulo: "Hábitos Practicados en casa", ids: [123, 124, 125, 126, 127, 128, 129] },
  5: { titulo: "Responsabilidad del estudiante con su aprendizaje", ids: [130, 131, 132, 133] },
};

export const BoletaPrimeroPrimaria = React.forwardRef(({ alumno, seccion, anio }: any, ref: any) => {
  if (!alumno) return null;

  // 1. Datos Generales
  
  const textoGrado = "Primero Primaria";
  const textoSeccion = seccion === "1" ? "A" : seccion === "2" ? "B" : "Única";
  const nombreMaestro = alumno.maestro || "Docente no asignado";
  const anioImprimir = anio || new Date().getFullYear();

  // 2. Funciones de ayuda
  const getMaterias = (bloqueId: number) => alumno.bloques[bloqueId] || [];

  const calcularPromedio = (materias: any[], unidad: string) => {
    const notas = materias.map((m) => parseFloat(m[unidad])).filter((n) => !isNaN(n));
    if (notas.length === 0) return "";
    const suma = notas.reduce((a, b) => a + b, 0);
    return Math.round(suma / notas.length).toString();
  };

  
  // 3. Estilos Base para las tablas (Más compactos y pequeños para encuadrar perfecto)
  const headerClass = "bg-[#17365D] text-white font-bold text-[10px] py-[2px] px-2 border border-[#17365D] uppercase text-center";
  const cellMateriaClass = "border border-[#17365D] font-bold text-[#17365D] text-[9.5px] py-[1.5px] px-2 text-left w-[44%]";
  const cellNotaClass = "border border-[#17365D] font-black text-slate-800 text-[10px] py-[1.5px] text-center w-[11%]";

  return (
    <div ref={ref} className="relative bg-white w-[210mm] h-[297mm] font-sans print:m-0 overflow-hidden">
      {/* FONDO DE LA BOLETA */}
      <img
        src="/boleta_primaria.jpg"
        className="absolute inset-0 w-full h-full object-fill z-0"
        alt="Fondo Boleta Primaria"
      />
      <div className="absolute top-[40px] left-[70px] w-[100px] text-center text-[50px] font-black text-red-400/80 tracking-widest z-10">
        {anioImprimir}
      </div>

      {/* DATOS DEL ESTUDIANTE (Posiciones ajustadas para no tapar los textos del fondo) */}
      <div className="absolute top-[200px] left-[250px] text-[12px] font-black text-[#17365D] uppercase tracking-wide z-10">
        {alumno.nombre}
      </div>
      <div className="absolute top-[223px] left-[157px] text-[12px] font-black text-[#17365D] uppercase tracking-wide z-10">
        {textoGrado}
      </div>
      <div className="absolute top-[223px] left-[360px] text-[12px] font-black text-[#17365D] uppercase tracking-wide z-10">
        {textoSeccion}
      </div>
      <div className="absolute top-[223px] left-[430px] text-[11px] font-bold text-[#17365D] uppercase z-10 flex items-center gap-1">
        <span className="text-gray-500 font-normal normal-case text-[10px]">Docente Titular:</span> {nombreMaestro}
      </div>

      {/* CONTENEDOR DE TABLAS (Centrado, más angosto [170mm] y con menos espacio entre tablas [gap-2]) */}
      <div className="absolute top-[245px] left-1/2 -translate-x-1/2 w-[170mm] z-10 flex flex-col gap-[6px]">
        
        {/* BLOQUE 1: Áreas Académicas */}
        <table className="w-full border-collapse shadow-sm">
          <thead>
            <tr>
              <th className={headerClass}>{BLOQUES_PRIMARIA[1].titulo}</th>
              <th className={headerClass}>I UNIDAD</th>
              <th className={headerClass}>II UNIDAD</th>
              <th className={headerClass}>III UNIDAD</th>
              <th className={headerClass}>IV UNIDAD</th>
              <th className={`${headerClass} leading-tight`}>NOTAS<br/>FINALES</th>
            </tr>
          </thead>
          <tbody>
            {getMaterias(1).map((m: any) => (
              <tr key={m.id_materia}>
                <td className={cellMateriaClass}>{m.materia}</td>
                <td className={cellNotaClass}>{m.u1}</td>
                <td className={cellNotaClass}>{m.u2}</td>
                <td className={cellNotaClass}>{m.u3}</td>
                <td className={cellNotaClass}>{m.u4}</td>
                <td className={cellNotaClass}></td> {/* Espacio vacío para notas finales */}
              </tr>
            ))}
            {/* FILA DE PROMEDIO */}
            <tr className="bg-[#17365D]/10">
              <td className={`${cellMateriaClass} text-center italic`}>Promedio por unidad</td>
              <td className={cellNotaClass}>{calcularPromedio(getMaterias(1), "u1")}</td>
              <td className={cellNotaClass}>{calcularPromedio(getMaterias(1), "u2")}</td>
              <td className={cellNotaClass}>{calcularPromedio(getMaterias(1), "u3")}</td>
              <td className={cellNotaClass}>{calcularPromedio(getMaterias(1), "u4")}</td>
              <td className={cellNotaClass}></td>
            </tr>
          </tbody>
        </table>

        {/* TÍTULO INTERMEDIO 1 */}
        <div className="text-center font-bold italic text-[12px] text-[#17365D] -mb-1 mt-1">
          Programas Educativos Extracurriculares:
        </div>

        {/* BLOQUE 2: Extracurriculares */}
        <table className="w-full border-collapse shadow-sm">
          <thead>
            <tr>
              <th className={headerClass}>{BLOQUES_PRIMARIA[2].titulo}</th>
              <th className={headerClass}>I UNIDAD</th>
              <th className={headerClass}>II UNIDAD</th>
              <th className={headerClass}>III UNIDAD</th>
              <th className={headerClass}>IV UNIDAD</th>
            </tr>
          </thead>
          <tbody>
            {getMaterias(2).map((m: any) => (
              <tr key={m.id_materia}>
                <td className={cellMateriaClass}>{m.materia}</td>
                <td className={cellNotaClass}>{m.u1}</td>
                <td className={cellNotaClass}>{m.u2}</td>
                <td className={cellNotaClass}>{m.u3}</td>
                <td className={cellNotaClass}>{m.u4}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TÍTULO INTERMEDIO 2 */}
        <div className="text-center font-bold italic text-[12px] text-[#17365D] -mb-1 mt-1">
          Resultado: Destaca, Avanza, Necesita Mejorar, Insatisfactorio:
        </div>

        {/* BLOQUE 3: Comportamiento */}
        <table className="w-full border-collapse shadow-sm">
          <thead>
            <tr>
              <th className={`${headerClass} leading-tight py-1`}>{BLOQUES_PRIMARIA[3].titulo}</th>
              <th className={headerClass}>I UNIDAD</th>
              <th className={headerClass}>II UNIDAD</th>
              <th className={headerClass}>III UNIDAD</th>
              <th className={headerClass}>IV UNIDAD</th>
            </tr>
          </thead>
          <tbody>
            {getMaterias(3).map((m: any) => (
              <tr key={m.id_materia}>
                <td className={cellMateriaClass}>{m.materia}</td>
                <td className={cellNotaClass}>{m.u1}</td>
                <td className={cellNotaClass}>{m.u2}</td>
                <td className={cellNotaClass}>{m.u3}</td>
                <td className={cellNotaClass}>{m.u4}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* BLOQUE 4: Hábitos */}
        <table className="w-full border-collapse shadow-sm">
          <thead>
            <tr>
              <th className={headerClass}>{BLOQUES_PRIMARIA[4].titulo}</th>
              <th className={headerClass}>I UNIDAD</th>
              <th className={headerClass}>II UNIDAD</th>
              <th className={headerClass}>III UNIDAD</th>
              <th className={headerClass}>IV UNIDAD</th>
            </tr>
          </thead>
          <tbody>
            {getMaterias(4).map((m: any) => (
              <tr key={m.id_materia}>
                <td className={cellMateriaClass}>{m.materia}</td>
                <td className={cellNotaClass}>{m.u1}</td>
                <td className={cellNotaClass}>{m.u2}</td>
                <td className={cellNotaClass}>{m.u3}</td>
                <td className={cellNotaClass}>{m.u4}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* BLOQUE 5: Aprendizaje */}
        <table className="w-full border-collapse shadow-sm">
          <thead>
            <tr>
              <th className={`${headerClass} leading-tight py-1`}>{BLOQUES_PRIMARIA[5].titulo}</th>
              <th className={headerClass}>I UNIDAD</th>
              <th className={headerClass}>II UNIDAD</th>
              <th className={headerClass}>III UNIDAD</th>
              <th className={headerClass}>IV UNIDAD</th>
            </tr>
          </thead>
          <tbody>
            {getMaterias(5).map((m: any) => (
              <tr key={m.id_materia}>
                <td className={`${cellMateriaClass} leading-tight`}>{m.materia}</td>
                <td className={cellNotaClass}>{m.u1}</td>
                <td className={cellNotaClass}>{m.u2}</td>
                <td className={cellNotaClass}>{m.u3}</td>
                <td className={cellNotaClass}>{m.u4}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>

      <style jsx>{`
        @media print {
          body { -webkit-print-color-adjust: exact; margin: 0; }
        }
      `}</style>
    </div>
  );
});

BoletaPrimeroPrimaria.displayName = "BoletaPrimeroPrimaria";