"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Modal, Row, Col, Card, Typography, Badge, Space, Button } from "antd";
import {
  LikeOutlined,
  DislikeOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph, Link } = Typography;

const sampleCourseData = {
  "teaching-english-as-a-foreign-language": {
    id: "teaching-english-as-a-foreign-language",
    title: "Teaching English as a Foreign Language (TEFL)",
    level: "Intermediate Level",
    learners: 298073,
    avgHours: "3-4 Avg Hours",
    accredited: true,
    publisher: {
      name: "Study Hub",
      description: "Qualified teachers of myriad subjects",
      logo: "https://cdn-icons-png.flaticon.com/512/197/197484.png",
    },
    likes: 1751,
    dislikes: 574,
    notInterested: true,
    description:
      "Teaching English as a foreign language (TEFL) is one of the world's fastest-growing educational fields. With over 100 000 open TEFL positions around the world, not including online learning, this field offers excellent employment opportunities for teaching English. This course is designed to train you to meet the standards required of a successful TEFL teacher. Sign up to turn your English skills into exciting work and travel opportunities.",
    whatYouWillLearn: [
      "Discuss the primary functions of language",
      "Define ‘ambiguity’ as it relates to the study of languages",
      "Identify the factors that influence reading in a second language",
      "List the stages of teaching listening skills",
      "Outline the various speaking strategies English learners should use",
      "Distinguish between the various types of motivation",
      "Compare the pros and cons of TEFL work abroad",
    ],
  },
};

export default function CourseDetailModal() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");
  const visible = Boolean(id);

  // Return nothing if no id or invalid id
  if (!id || Array.isArray(id)) return null;

  const course = sampleCourseData[id];
  if (!course) return null;

  const handleClose = () => {
    // Remove id query param and stay on current page without reload
    router.push("/", undefined, { shallow: true });
  };

  return (
    <Modal
      title={course.title}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={900}
      destroyOnHidden
      styles={{ body: { padding: 24 } }}
    >
      {/* Breadcrumb */}
      <Text type="secondary" style={{ marginBottom: 12, display: "block" }}>
        Home &gt; Teaching & Academics &gt; English Language &gt;{" "}
        <Link strong>{course.title}</Link>
      </Text>

      <Row gutter={[24, 24]}>
        {/* Left Card */}
        <Col xs={24} md={8}>
          <Card
            cover={
              <img
                alt={course.title}
                src="/course-teacher.jpg"
                style={{ objectFit: "cover", height: 200 }}
              />
            }
          >
            <Badge
              count={course.level.toUpperCase()}
              style={{ backgroundColor: "#52c41a", marginBottom: 12 }}
            />
            <Title level={4}>{course.title}</Title>
            <Text strong>
              <UserOutlined /> {course.learners.toLocaleString()} Learners
              already enrolled
            </Text>

            <Space
              size="large"
              style={{ marginTop: 16, marginBottom: 16, display: "flex" }}
            >
              <Space>
                <LikeOutlined /> {course.likes.toLocaleString()}
              </Space>
              <Space>
                <DislikeOutlined /> {course.dislikes.toLocaleString()}
              </Space>
              <Space>
                {course.notInterested && (
                  <Text type="secondary">Not Interested</Text>
                )}
              </Space>
            </Space>

            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Space>
                <ClockCircleOutlined />
                <Text>{course.avgHours}</Text>
              </Space>

              {course.accredited && (
                <Space>
                  <SafetyCertificateOutlined />
                  <Text>CPD Accredited</Text>
                </Space>
              )}

              <Button type="primary" block>
                Start Learning
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Right Content */}
        <Col xs={24} md={16}>
          <Title level={3}>{course.title}</Title>
          <Paragraph strong style={{ fontWeight: 600 }}>
            Learn how to teach English as a second language in this free online
            TEFL training course and climb up the TEFL ladder.
          </Paragraph>

          <Paragraph>{course.description}</Paragraph>

          {/* Publisher info & Start button */}
          <Space
            align="center"
            style={{
              marginBottom: 24,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Space>
              <img
                src={course.publisher.logo}
                alt={course.publisher.name}
                style={{ width: 40, height: 40, borderRadius: 6 }}
              />
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  COURSE PUBLISHER
                </Text>
                <br />
                <Text strong>{course.publisher.name}</Text>
                <br />
                <Text type="secondary">{course.publisher.description}</Text>
              </div>
            </Space>
            <Button type="primary" size="large">
              Start Learning
            </Button>
          </Space>

          {/* What You Will Learn */}
          <Card
            title="What You Will Learn In This Free Course"
            style={{ backgroundColor: "#e6f7ff" }}
          >
            <Row gutter={[16, 16]}>
              {course.whatYouWillLearn.map((point, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Space>
                    <CheckCircleOutlined style={{ color: "#1890ff" }} />
                    <Text>{point}</Text>
                  </Space>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </Modal>
  );
}
