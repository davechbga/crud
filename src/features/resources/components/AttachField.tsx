import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Componente para el campo de adjunto
export const AttachmentField = ({
  attachmentType,
  setAttachmentType,
  linkUrl,
  onLinkChange,
  onFileChange,
  fileUrl,
}: {
  attachmentType: "link" | "file";
  setAttachmentType: (type: "link" | "file") => void;
  linkUrl: string;
  onLinkChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileUrl: string;
}) => (
  <div className="space-y-4">
    <Label>Adjunto</Label>
    <Tabs
      value={attachmentType}
      onValueChange={(value) => setAttachmentType(value as "link" | "file")}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="link">Enlace Web</TabsTrigger>
        <TabsTrigger value="file">Archivo PDF</TabsTrigger>
      </TabsList>

      <TabsContent value="link" className="space-y-2">
        <Label htmlFor="linkUrl">URL del recurso</Label>
        <Input
          id="linkUrl"
          type="url"
          value={linkUrl}
          onChange={(e) => onLinkChange(e.target.value)}
          placeholder="https://ejemplo.com/recurso"
        />
      </TabsContent>

      <TabsContent value="file" className="space-y-2">
        <Label htmlFor="fileUrl">Archivo PDF</Label>
        <Input id="fileUrl" type="file" accept=".pdf" onChange={onFileChange} />
        {fileUrl && (
          <p
            className="text-sm text-gray-600 max-w-[220px] truncate"
            title={fileUrl}
          >
            Archivo:{" "}
            <a
              target="_blank"
              href={fileUrl}
              className="text-blue-600 hover:underline"
            >
              {fileUrl}
            </a>
          </p>
        )}
      </TabsContent>
    </Tabs>
  </div>
);
