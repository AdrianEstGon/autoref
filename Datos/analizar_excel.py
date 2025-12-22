import pandas as pd
import os
import re
from pathlib import Path

def detect_data_type(series):
    """Detecta el tipo de dato más probable de una columna"""
    non_null = series.dropna()
    if len(non_null) == 0:
        return "vacío"
    
    # Convertir a string para análisis
    sample = non_null.astype(str).head(100)
    
    # Patrones
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    phone_pattern = r'^[\d\s\-\+\(\)]{6,20}$'
    date_pattern = r'^\d{1,4}[-/]\d{1,2}[-/]\d{1,4}$'
    time_pattern = r'^\d{1,2}:\d{2}(:\d{2})?$'
    
    # Contar tipos
    emails = sum(1 for x in sample if re.match(email_pattern, str(x).strip()))
    phones = sum(1 for x in sample if re.match(phone_pattern, str(x).strip()) and not str(x).strip().replace(' ','').replace('-','').replace('+','').replace('(','').replace(')','').isalpha())
    
    if emails > len(sample) * 0.5:
        return "email"
    
    # Verificar si es fecha (pandas puede detectarla)
    try:
        if pd.api.types.is_datetime64_any_dtype(series):
            return "fecha/hora"
    except:
        pass
    
    # Verificar numérico
    try:
        numeric = pd.to_numeric(non_null, errors='coerce')
        if numeric.notna().sum() > len(non_null) * 0.8:
            if (numeric == numeric.astype(int)).all():
                # Verificar si parece ID
                if numeric.min() >= 0 and numeric.is_monotonic_increasing:
                    return "entero (posible ID)"
                return "entero"
            return "decimal"
    except:
        pass
    
    # Verificar booleano
    bool_values = {'true', 'false', 'si', 'no', 'sí', '1', '0', 'yes', 'no', 'verdadero', 'falso'}
    str_lower = non_null.astype(str).str.lower().str.strip()
    if str_lower.isin(bool_values).sum() > len(non_null) * 0.8:
        return "booleano"
    
    # Verificar si parece teléfono
    if phones > len(sample) * 0.5:
        return "teléfono"
    
    # Verificar longitud para clasificar texto
    avg_len = non_null.astype(str).str.len().mean()
    unique_ratio = len(non_null.unique()) / len(non_null) if len(non_null) > 0 else 0
    
    if unique_ratio < 0.1 and len(non_null.unique()) < 20:
        return f"categoría ({len(non_null.unique())} valores únicos)"
    elif avg_len > 100:
        return "texto largo"
    else:
        return "texto"

def get_sample_values(series, n=3):
    """Obtiene n valores de ejemplo no nulos"""
    non_null = series.dropna()
    if len(non_null) == 0:
        return ["(vacío)"]
    samples = non_null.head(n).tolist()
    # Truncar valores largos
    return [str(s)[:50] + "..." if len(str(s)) > 50 else str(s) for s in samples]

def analyze_excel(filepath):
    """Analiza un archivo Excel"""
    print(f"\n{'='*80}")
    print(f"📊 ARCHIVO: {os.path.basename(filepath)}")
    print(f"{'='*80}")
    
    try:
        df = pd.read_excel(filepath)
    except Exception as e:
        print(f"❌ Error al leer: {e}")
        return None
    
    total_rows = len(df)
    print(f"📝 Filas de datos: {total_rows}")
    print(f"📋 Columnas: {len(df.columns)}")
    print()
    
    column_info = []
    
    for col in df.columns:
        null_count = df[col].isna().sum()
        null_pct = (null_count / total_rows * 100) if total_rows > 0 else 0
        data_type = detect_data_type(df[col])
        samples = get_sample_values(df[col])
        
        # Determinar estado
        if null_pct == 100:
            status = "🔴 100% VACÍA"
        elif null_pct > 50:
            status = f"🟡 {null_pct:.1f}% vacío"
        elif null_pct > 0:
            status = f"🟢 {null_pct:.1f}% vacío"
        else:
            status = "✅ Completa"
        
        column_info.append({
            'nombre': col,
            'null_pct': null_pct,
            'tipo': data_type,
            'samples': samples,
            'status': status
        })
        
        print(f"  📌 {col}")
        print(f"     Estado: {status}")
        print(f"     Tipo: {data_type}")
        print(f"     Ejemplos: {samples}")
        print()
    
    return {
        'filename': os.path.basename(filepath),
        'rows': total_rows,
        'columns': column_info
    }

def identify_relationships(all_results):
    """Identifica posibles relaciones entre tablas"""
    print("\n" + "="*80)
    print("🔗 ANÁLISIS DE RELACIONES ENTRE TABLAS")
    print("="*80)
    
    # Mapear columnas por archivo
    column_map = {}
    for result in all_results:
        if result:
            filename = result['filename'].replace('.xlsx', '')
            for col in result['columns']:
                col_name = str(col['nombre']).lower()
                if col_name not in column_map:
                    column_map[col_name] = []
                column_map[col_name].append(filename)
    
    # Buscar patrones de FK
    fk_patterns = ['id', '_id', 'codigo', 'cod', 'ref']
    relationships = []
    
    for result in all_results:
        if not result:
            continue
        filename = result['filename'].replace('.xlsx', '')
        
        for col in result['columns']:
            col_name = str(col['nombre']).lower()
            
            # Buscar columnas que parecen FK
            for pattern in fk_patterns:
                if pattern in col_name and col_name != 'id':
                    # Extraer posible tabla referenciada
                    ref_table = col_name.replace('id', '').replace('_id', '').replace('codigo', '').replace('cod', '').strip('_')
                    if ref_table:
                        relationships.append({
                            'tabla': filename,
                            'columna': col['nombre'],
                            'ref_potencial': ref_table,
                            'tipo': col['tipo']
                        })
    
    # Columnas comunes entre tablas
    print("\n📊 Columnas que aparecen en múltiples tablas:")
    for col, tables in sorted(column_map.items()):
        if len(tables) > 1 and col not in ['id']:
            print(f"  - '{col}' en: {', '.join(tables)}")
    
    print("\n🔑 Posibles Foreign Keys identificadas:")
    for rel in relationships:
        print(f"  - {rel['tabla']}.{rel['columna']} -> {rel['ref_potencial']}? (tipo: {rel['tipo']})")
    
    return relationships

def main():
    datos_path = r"c:\Users\ruben\Desktop\autoref\Datos"
    excel_files = [f for f in os.listdir(datos_path) if f.endswith('.xlsx')]
    
    print("🔍 ANÁLISIS COMPLETO DE ARCHIVOS EXCEL")
    print(f"📁 Carpeta: {datos_path}")
    print(f"📊 Archivos encontrados: {len(excel_files)}")
    
    all_results = []
    problematic_columns = []
    
    for excel_file in sorted(excel_files):
        filepath = os.path.join(datos_path, excel_file)
        result = analyze_excel(filepath)
        all_results.append(result)
        
        if result:
            for col in result['columns']:
                if col['null_pct'] == 100:
                    problematic_columns.append({
                        'archivo': result['filename'],
                        'columna': col['nombre'],
                        'problema': 'Completamente vacía'
                    })
                elif col['null_pct'] > 50:
                    problematic_columns.append({
                        'archivo': result['filename'],
                        'columna': col['nombre'],
                        'problema': f'{col["null_pct"]:.1f}% vacío'
                    })
    
    # Relaciones
    relationships = identify_relationships(all_results)
    
    # Resumen final
    print("\n" + "="*80)
    print("📋 RESUMEN FINAL")
    print("="*80)
    
    print("\n📁 Archivos analizados:")
    for result in all_results:
        if result:
            print(f"  - {result['filename']}: {result['rows']} filas, {len(result['columns'])} columnas")
    
    print("\n⚠️ Columnas problemáticas:")
    for prob in problematic_columns:
        print(f"  - {prob['archivo']}.{prob['columna']}: {prob['problema']}")
    
    print("\n✅ Análisis completado")

if __name__ == "__main__":
    main()
