import React from "react";

const TITULOS_PRIMARIA: Record<number, string> = {
  1: "Áreas Académicas",
  2: "Programas Educativos Extracurriculares",
  3: "Responsabilidades del estudiante con su comportamiento",
  4: "Hábitos Practicados en casa",
  5: "Responsabilidad del estudiante con su aprendizaje",
};

const TITULOS_MEDIO: Record<number, string> = {
  1: "Áreas y Sub áreas",
  2: "Áreas Educativas Extracurriculares",
  3: "Responsabilidad del Estudiante",
};

const TITULOS_PERITO: Record<number, string> = {
  1: "Áreas Académicas",
  2: "Áreas Académicas Extracurriculares",
  3: "Áreas Extracurriculares",
  4: "Responsabilidad del Estudiante",
};

const NOMBRES_GRADOS: Record<string, string> = {
  "6": "1ro Primaria", "7": "2do Primaria", "2": "3ro Primaria", 
  "8": "4to Primaria", "9": "5to Primaria", "10": "6to Primaria",
  "14": "1ro Básico", "15": "2do Básico", "16": "3ro Básico",
  "17": "4to Bachillerato", "18": "5to Bachillerato",
  "19": "4to Perito", "20": "5to Perito", "21": "6to Perito"
};

export const BoletaGeneral = React.forwardRef(({ alumno, seccion, anio }: any, ref: any) => {
  if (!alumno) return null;

  const idGradoString = String(alumno.id_grado);
  const textoGrado = NOMBRES_GRADOS[idGradoString] || "Grado no definido";
  const textoSeccion = seccion === "1" ? "A" : seccion === "2" ? "B" : seccion === "3" ? "C" : "Única";
  const nombreMaestro = alumno.maestro || "Docente no asignado";
  
  const anioImprimir = anio || new Date().getFullYear();

  const esBasicoOBachillerato = ["14", "15", "16", "17", "18"].includes(idGradoString);
  const esPerito = ["19", "20", "21"].includes(idGradoString);

  const getMaterias = (bloqueId: number) => alumno.bloques[bloqueId] || [];

  const calcularPromedioBloque = (materias: any[], unidad: string) => {
    const notas = materias.map((m: any) => parseFloat(m[unidad])).filter((n: number) => !isNaN(n));
    if (notas.length === 0) return "";
    const suma = notas.reduce((a: number, b: number) => a + b, 0);
    return Math.round(suma / notas.length).toString();
  };

  const calcularPromedioPerito = (unidad: string) => {
    const matB1 = getMaterias(1);
    const matB2 = getMaterias(2);
    const materiasCombinadas = [...matB1, ...matB2];
    const notas = materiasCombinadas.map((m) => parseFloat(m[unidad])).filter((n) => !isNaN(n));
    if (notas.length === 0) return "";
    const suma = notas.reduce((a, b) => a + b, 0);
    return Math.round(suma / notas.length).toString();
  };

  const headerClass = "bg-[#17365D] text-white font-bold text-[10px] py-[2px] px-2 border border-[#17365D] uppercase text-center";
  const cellMateriaClass = "border border-[#17365D] font-bold text-[#17365D] text-[9.5px] py-[1.5px] px-2 text-left w-[44%]";
  
  const renderNotaCell = (nota: string | number | undefined) => {
    const num = parseFloat(String(nota));
    const isReprobado = !isNaN(num) && num < 69;
    const textColor = isReprobado ? "text-red-600" : "text-slate-800";
    return (
      <td className={`border border-[#17365D] font-black ${textColor} text-[10px] py-[1.5px] text-center w-[11%]`}>
        {nota}
      </td>
    );
  };

  const getTituloBloque = (bloqueId: number) => {
    if (esPerito) return TITULOS_PERITO[bloqueId] || "";
    if (esBasicoOBachillerato) return TITULOS_MEDIO[bloqueId] || "";
    return TITULOS_PRIMARIA[bloqueId] || "";
  };

  // 💡 Para Perito, el contenido suele ser más corto y dejaba mucho espacio en blanco.
  // Estiramos el contenedor (top+bottom) y distribuimos el espacio ENTRE bloques.
  const tablasContainerClass = `absolute top-[245px] left-1/2 -translate-x-1/2 w-[170mm] z-10 flex flex-col ${esPerito ? "bottom-[65px] justify-between" : "gap-[6px]"}`;

  return (
    <div ref={ref} className="relative bg-white w-[210mm] h-[297mm] font-sans print:m-0 overflow-hidden">
      <img src="/boleta_primaria.jpg" className="absolute inset-0 w-full h-full object-fill z-0" alt="Fondo Boleta General" />

      <div className="absolute top-[40px] left-[70px] w-[100px] text-center text-[50px] font-black text-red-400/80 tracking-widest z-10">
        {anioImprimir}
      </div>
      
      <div className="absolute top-[200px] left-[250px] text-[12px] font-black text-[#17365D] uppercase tracking-wide z-10">{alumno.nombre}</div>
      <div className="absolute top-[223px] left-[157px] text-[12px] font-black text-[#17365D] uppercase tracking-wide z-10">{textoGrado}</div>
      <div className="absolute top-[223px] left-[360px] text-[12px] font-black text-[#17365D] uppercase tracking-wide z-10">{textoSeccion}</div>
      <div className="absolute top-[223px] left-[430px] text-[11px] font-bold text-[#17365D] uppercase z-10 flex items-center gap-1">
        <span className="text-gray-500 font-normal normal-case text-[10px]">Docente Titular:</span> {nombreMaestro}
      </div>

      <div className={tablasContainerClass}>
        
        {/* BLOQUE 1 */}
        {getMaterias(1).length > 0 && (
          <div>
            <table className="w-full border-collapse shadow-sm">
              <thead>
                <tr>
                  <th className={headerClass}>{getTituloBloque(1)}</th>
                  <th className={headerClass}>I UNIDAD</th><th className={headerClass}>II UNIDAD</th><th className={headerClass}>III UNIDAD</th><th className={headerClass}>IV UNIDAD</th><th className={`${headerClass} leading-tight`}>NOTAS<br/>FINALES</th>
                </tr>
              </thead>
              <tbody>
                {getMaterias(1).map((m: any) => (
                  <tr key={m.id_materia}>
                    <td className={cellMateriaClass}>{m.materia}</td>
                    {renderNotaCell(m.u1)}{renderNotaCell(m.u2)}{renderNotaCell(m.u3)}{renderNotaCell(m.u4)}
                    <td className="border border-[#17365D] font-black text-slate-800 text-[10px] py-[1.5px] text-center w-[11%]"></td> 
                  </tr>
                ))}
                {!esPerito && (
                  <tr className="bg-[#17365D]/10">
                    <td className={`${cellMateriaClass} text-center italic`}>Promedio Exacto</td>
                    {renderNotaCell(calcularPromedioBloque(getMaterias(1), "u1"))}
                    {renderNotaCell(calcularPromedioBloque(getMaterias(1), "u2"))}
                    {renderNotaCell(calcularPromedioBloque(getMaterias(1), "u3"))}
                    {renderNotaCell(calcularPromedioBloque(getMaterias(1), "u4"))}
                    <td className="border border-[#17365D]"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* BLOQUE 2 */}
        {getMaterias(2).length > 0 && (
          <div>
            {!esPerito && (
              <div className="text-center font-bold italic text-[12px] text-[#17365D] -mb-1 mt-1">
                {esBasicoOBachillerato ? "Resultado: Destaca, Avanza, Necesita Mejorar" : "Programas Educativos Extracurriculares:"}
              </div>
            )}
            <table className="w-full border-collapse shadow-sm">
              <thead>
                <tr>
                  <th className={headerClass}>{getTituloBloque(2)}</th>
                  <th className={headerClass}>I UNIDAD</th><th className={headerClass}>II UNIDAD</th><th className={headerClass}>III UNIDAD</th><th className={headerClass}>IV UNIDAD</th>
                  {esPerito && <th className={`${headerClass} leading-tight`}>NOTAS<br/>FINALES</th>}
                </tr>
              </thead>
              <tbody>
                {getMaterias(2).map((m: any) => (
                  <tr key={m.id_materia}>
                    <td className={cellMateriaClass}>{m.materia}</td>
                    {renderNotaCell(m.u1)}{renderNotaCell(m.u2)}{renderNotaCell(m.u3)}{renderNotaCell(m.u4)}
                    {esPerito && <td className="border border-[#17365D] font-black text-slate-800 text-[10px] py-[1.5px] text-center w-[11%]"></td>}
                  </tr>
                ))}
                {esPerito && (
                  <tr className="bg-[#17365D]/10">
                    <td className={`${cellMateriaClass} text-center italic`}>Promedio Exacto (General)</td>
                    {renderNotaCell(calcularPromedioPerito("u1"))}
                    {renderNotaCell(calcularPromedioPerito("u2"))}
                    {renderNotaCell(calcularPromedioPerito("u3"))}
                    {renderNotaCell(calcularPromedioPerito("u4"))}
                    <td className="border border-[#17365D]"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* BLOQUE 3 */}
        {getMaterias(3).length > 0 && (
          <div>
            <div className="text-center font-bold italic text-[12px] text-[#17365D] -mb-1 mt-1">Resultado: Destaca, Avanza, Necesita Mejorar, Insatisfactorio:</div>
            <table className="w-full border-collapse shadow-sm">
              <thead><tr><th className={`${headerClass} leading-tight py-1`}>{getTituloBloque(3)}</th><th className={headerClass}>I UNIDAD</th><th className={headerClass}>II UNIDAD</th><th className={headerClass}>III UNIDAD</th><th className={headerClass}>IV UNIDAD</th></tr></thead>
              <tbody>{getMaterias(3).map((m: any) => (<tr key={m.id_materia}><td className={cellMateriaClass}>{m.materia}</td>{renderNotaCell(m.u1)}{renderNotaCell(m.u2)}{renderNotaCell(m.u3)}{renderNotaCell(m.u4)}</tr>))}</tbody>
            </table>
          </div>
        )}

        {/* 💡 AQUÍ SE INVIERTE EL ORDEN: PRIMERO DIBUJAMOS EL BLOQUE 5 (APRENDIZAJE) */}
        {getMaterias(5).length > 0 && (
          <div>
            <table className="w-full border-collapse shadow-sm mt-1">
              <thead><tr><th className={`${headerClass} leading-tight py-1`}>{getTituloBloque(5)}</th><th className={headerClass}>I UNIDAD</th><th className={headerClass}>II UNIDAD</th><th className={headerClass}>III UNIDAD</th><th className={headerClass}>IV UNIDAD</th></tr></thead>
              <tbody>{getMaterias(5).map((m: any) => (<tr key={m.id_materia}><td className={`${cellMateriaClass} leading-tight`}>{m.materia}</td>{renderNotaCell(m.u1)}{renderNotaCell(m.u2)}{renderNotaCell(m.u3)}{renderNotaCell(m.u4)}</tr>))}</tbody>
            </table>
          </div>
        )}

        {/* 💡 Y HASTA EL FINAL DIBUJAMOS EL BLOQUE 4 (HÁBITOS) PARA QUE QUEDE ABAJO */}
        {getMaterias(4).length > 0 && (
          <div>
            <table className="w-full border-collapse shadow-sm mt-1">
              <thead><tr><th className={headerClass}>{getTituloBloque(4)}</th><th className={headerClass}>I UNIDAD</th><th className={headerClass}>II UNIDAD</th><th className={headerClass}>III UNIDAD</th><th className={headerClass}>IV UNIDAD</th></tr></thead>
              <tbody>{getMaterias(4).map((m: any) => (<tr key={m.id_materia}><td className={cellMateriaClass}>{m.materia}</td>{renderNotaCell(m.u1)}{renderNotaCell(m.u2)}{renderNotaCell(m.u3)}{renderNotaCell(m.u4)}</tr>))}</tbody>
            </table>
          </div>
        )}

      </div>
      <style jsx>{`@media print { body { -webkit-print-color-adjust: exact; margin: 0; } }`}</style>
    </div>
  );
});

BoletaGeneral.displayName = "BoletaGeneral";