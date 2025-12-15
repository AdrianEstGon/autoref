# =========================
# BUILD STAGE
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiar el csproj y restaurar
COPY AutoRef_API.csproj ./
RUN dotnet restore AutoRef_API.csproj

# Copiar todo el código
COPY . ./
RUN dotnet publish AutoRef_API.csproj -c Release -o /app/publish

# =========================
# RUNTIME STAGE
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Variables de entorno por defecto
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://0.0.0.0:${PORT:-10000}

# Copiar la app publicada
COPY --from=build /app/publish .

# Exponer el puerto
EXPOSE ${PORT:-10000}

ENTRYPOINT ["dotnet", "AutoRef_API.dll"]
