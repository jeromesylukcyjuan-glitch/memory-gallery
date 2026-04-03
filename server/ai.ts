import { invokeLLM } from "./_core/llm";

/**
 * 为图片生成AI描述和标签
 * @param imageUrl 图片URL
 * @returns 返回生成的标题、描述和标签
 */
export async function generateImageDescription(imageUrl: string) {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `你是一个专业的图片分析助手。你的任务是分析用户上传的照片，并生成：
1. 一个简洁有趣的标题（不超过20个字）
2. 一个详细的描述（不超过100个字）
3. 3-5个相关的标签（用逗号分隔）

请用JSON格式返回结果，格式如下：
{
  "title": "标题",
  "description": "描述",
  "tags": "标签1,标签2,标签3"
}`,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "auto",
              },
            },
            {
              type: "text",
              text: "请分析这张照片，生成标题、描述和标签。",
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "image_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "图片的简洁标题",
              },
              description: {
                type: "string",
                description: "图片的详细描述",
              },
              tags: {
                type: "string",
                description: "用逗号分隔的标签",
              },
            },
            required: ["title", "description", "tags"],
            additionalProperties: false,
          },
        },
      },
    });

    // 解析LLM返回的JSON
    const content = response.choices[0]?.message.content;
    if (!content || typeof content !== "string") {
      throw new Error("LLM返回空内容");
    }

    const parsed = JSON.parse(content);
    return {
      title: parsed.title,
      description: parsed.description,
      tags: parsed.tags.split(",").map((tag: string) => tag.trim()),
    };
  } catch (error) {
    console.error("Failed to generate image description:", error);
    throw new Error("AI标注失败");
  }
}

/**
 * 为视频生成AI描述和标签
 * @param videoUrl 视频URL
 * @returns 返回生成的标题、描述和标签
 */
export async function generateVideoDescription(videoUrl: string) {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `你是一个专业的视频分析助手。你的任务是分析用户上传的视频，并生成：
1. 一个简洁有趣的标题（不超过20个字）
2. 一个详细的描述（不超过100个字）
3. 3-5个相关的标签（用逗号分隔）

请用JSON格式返回结果。`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "请分析这个视频，生成标题、描述和标签。",
            },
            {
              type: "file_url",
              file_url: {
                url: videoUrl,
                mime_type: "video/mp4",
              },
            },
          ],
        },
      ],
    });

    // 解析LLM返回的内容
    const content = response.choices[0]?.message.content;
    if (!content || typeof content !== "string") {
      throw new Error("LLM返回空内容");
    }

    // 尝试从响应中提取JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("无法从LLM响应中提取JSON");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const tagsArray = Array.isArray(parsed.tags)
      ? parsed.tags
      : typeof parsed.tags === "string"
      ? parsed.tags.split(",").map((tag: string) => tag.trim())
      : [];
    return {
      title: parsed.title,
      description: parsed.description,
      tags: tagsArray,
    };
  } catch (error) {
    console.error("Failed to generate video description:", error);
    throw new Error("AI标注失败");
  }
}
