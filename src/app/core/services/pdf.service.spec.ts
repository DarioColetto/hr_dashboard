import { TestBed } from '@angular/core/testing';
import { PdfService } from './pdf.service';

describe('PdfService', () => {
  let service: PdfService;

  const mockOpen = jest.fn().mockResolvedValue(undefined);
  const mockCreatePdf = jest.fn().mockReturnValue({ open: mockOpen });
  const mockWriteFileSync = jest.fn();
  const mockPdfMake = {
    virtualfs: { writeFileSync: mockWriteFileSync },
    createPdf: mockCreatePdf,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreatePdf.mockReturnValue({ open: mockOpen });
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfService);
    jest.spyOn(service as any, 'getPdfMake').mockResolvedValue(mockPdfMake);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('download() calls createPdf with the document definition', async () => {
    const doc = { content: ['Hello World'] };
    await service.download(doc);
    expect(mockCreatePdf).toHaveBeenCalledWith(doc);
  });

  it('download() calls open() on the pdf document', async () => {
    await service.download({ content: ['Test'] });
    expect(mockOpen).toHaveBeenCalled();
  });

  it('download() rejects if createPdf throws', async () => {
    mockCreatePdf.mockImplementationOnce(() => {
      throw new Error('pdfmake error');
    });
    await expect(service.download({ content: ['Test'] })).rejects.toThrow('pdfmake error');
  });
});
