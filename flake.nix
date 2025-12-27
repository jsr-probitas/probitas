{
  description = "Probitas development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            deno
            # Native library dependencies for database clients
            stdenv.cc.cc.lib  # C++ standard library (required by most native bindings)
            sqlite            # SQLite library (for @db/sqlite via FFI)
            duckdb            # DuckDB library (for @duckdb/node-api)
          ];

          shellHook = ''
            # Add native library paths for database clients
            export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath [
              pkgs.stdenv.cc.cc.lib
              pkgs.sqlite
              pkgs.duckdb
            ]}:$LD_LIBRARY_PATH"
            echo "Entering Probitas development environment"
          '';
        };
      }
    );
}
