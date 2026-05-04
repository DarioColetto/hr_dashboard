import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PdfService {
  // Dynamic import avoids esbuild's "Cannot assign to import" restriction on CJS modules
  private async getPdfMake(): Promise<any> {
    const [pdfMakeModule, pdfFontsModule] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts'),
    ]);
    const raw = pdfMakeModule as any;
    const pdfMake = raw.default ?? raw;
    // pdfmake 0.3.x: fonts must be written as binary to virtualfs (base64 decoded)
    // esbuild may wrap CJS modules with a `default` export
    const rawVfs = pdfFontsModule as any;
    const vfs = rawVfs.default ?? rawVfs;
    Object.entries(vfs).forEach(([filename, b64]: [string, any]) => {
      if (typeof b64 !== 'string') return;
      pdfMake.virtualfs.writeFileSync(
        filename,
        Uint8Array.from(atob(b64), (c: string) => c.charCodeAt(0))
      );
    });
    return pdfMake;
  }

  async download(docDefinition: object): Promise<void> {
    const pdfMake = await this.getPdfMake();
    await pdfMake.createPdf(docDefinition).open();
  }
}
