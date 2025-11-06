#!/bin/bash
# Script para generar iconos PNG desde SVG (requiere ImageMagick o Inkscape)

if command -v convert &> /dev/null; then
    # Usando ImageMagick
    convert -background none icon.svg -resize 192x192 icon-192.png
    convert -background none icon.svg -resize 512x512 icon-512.png
    echo "✅ Iconos generados con ImageMagick"
elif command -v inkscape &> /dev/null; then
    # Usando Inkscape
    inkscape icon.svg --export-filename=icon-192.png --export-width=192 --export-height=192
    inkscape icon.svg --export-filename=icon-512.png --export-width=512 --export-height=512
    echo "✅ Iconos generados con Inkscape"
else
    echo "⚠️  No se encontró ImageMagick ni Inkscape"
    echo "📝 Por favor instala: sudo apt install imagemagick"
    echo "📝 O usa un conversor online: https://convertio.co/es/svg-png/"
    echo ""
    echo "📋 Mientras tanto, el icono SVG funcionará"
fi
