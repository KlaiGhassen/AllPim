import { InitialazerService } from "./initializer.service";

export function configurationFactory(
  Provider: InitialazerService
): () => Promise<any> {
  return () => Provider.Init();
}
